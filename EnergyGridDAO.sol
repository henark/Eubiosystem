// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

/**
 * @title EnergyGridDAO
 * @dev Smart contract para uma DAO de microrrede de energia comunitária
 * @notice Este contrato implementa os princípios da Engenharia Eudaimónica:
 * Autopoiese, Integração Sistémica, Metacognição e Ressonância Semântica
 */
contract EnergyGridDAO {

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }
    
    // ============================================================================
    // ESTRUTURAS DE DADOS E ESTADO
    // ============================================================================
    
    struct Member {
        bool isRegistered;
        uint256 energyCredits;
        uint256 invalidReportsCount;
        bool isTemporarilySuspended;
        uint256 lastReportTimestamp;
        uint256 votingCredits; // Para votação quadrática
        uint256 lastVotingCreditsUpdate; // Timestamp da última atualização
    }
    
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) votePower; // Para votação quadrática
    }
    
    // Mapeamentos principais
    mapping(address => Member) public members;
    mapping(uint256 => Proposal) public proposals;
    
    // Variáveis de estado para consciência sistémica
    uint256 public totalEnergyProduced;
    uint256 public totalEnergyCredits;
    uint256 public memberCount;
    uint256 public proposalCount;
    uint256 public constant MAX_INVALID_REPORTS = 3;
    uint256 public constant SUSPENSION_DURATION = 7 days;
    
    // Sistema de precificação dinâmica
    uint256 public baseFeeRate = 100; // Taxa base em pontos (1% = 100 pontos)
    uint256 public constant MAX_FEE_RATE = 1000; // Máximo 10%
    
    // Sistema de Votação Quadrática
    uint256 public constant MONTHLY_VOTING_CREDITS = 100;
    uint256 public constant MAX_VOTING_CREDITS = 500;
    uint256 public constant MAX_VOTE_INTENSITY = 10;
    uint256 public constant VOTING_CREDITS_INTERVAL = 30 days;

    // Endereço do relayer autorizado a submeter votos anónimos
    address public relayer;

    // ============================================================================
    // CONSTRUTOR
    // ============================================================================

    constructor() {
        relayer = msg.sender;
    }
    
    // ============================================================================
    // EVENTOS (Sistema Nervoso do Contrato)
    // ============================================================================
    
    event MemberRegistered(address indexed member, uint256 timestamp);
    event EnergyProduced(address indexed member, uint256 amount, uint256 creditsEarned);
    event CreditsTransferred(address indexed from, address indexed to, uint256 amount, uint256 fee);
    event MemberSuspended(address indexed member, uint256 suspensionEndTime);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 votePower);
    event ProposalExecuted(uint256 indexed proposalId, bool success);
    event SystemBalanceAlert(uint256 totalSupply, uint256 totalDemand, uint256 newFeeRate);
    event VotingCreditsUpdated(address indexed member, uint256 newCredits, uint256 timestamp);
    event QuadraticVoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 intensity, uint256 cost);
    event AnonymousVoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 intensity, uint256 cost);
    
    // ============================================================================
    // MODIFICADORES (Membranas Celulares)
    // ============================================================================
    
    modifier onlyMember() {
        require(members[msg.sender].isRegistered, "Caller is not a registered member");
        require(!members[msg.sender].isTemporarilySuspended, "Member is temporarily suspended");
        _;
    }
    
    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }
    
    modifier notSuspended(address member) {
        require(!members[member].isTemporarilySuspended, "Member is suspended");
        _;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Caller is not the authorized relayer");
        _;
    }
    
    // ============================================================================
    // FUNÇÕES PRINCIPAIS
    // ============================================================================
    
    /**
     * @notice Registra um novo membro na DAO
     * @dev Implementa autopoiese prevenindo duplo registro
     */
    function registerMember() external {
        require(!members[msg.sender].isRegistered, "Address is already registered as a member");
        
        members[msg.sender] = Member({
            isRegistered: true,
            energyCredits: 0,
            invalidReportsCount: 0,
            isTemporarilySuspended: false,
            lastReportTimestamp: 0,
            votingCredits: MONTHLY_VOTING_CREDITS, // Inicia com créditos completos
            lastVotingCreditsUpdate: block.timestamp
        });
        
        memberCount++;
        emit MemberRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Permite a um membro reportar produção de energia
     * @param energyAmount Quantidade de energia produzida em kWh
     * @dev Implementa circuit breaker para relatórios inválidos
     */
    function reportEnergyProduction(uint256 energyAmount) 
        external 
        onlyMember 
        validAmount(energyAmount) 
    {
        Member storage member = members[msg.sender];
        
        // Verificação de plausibilidade (evita valores absurdos)
        require(energyAmount <= 10000, "Energy amount seems unrealistic (max 10,000 kWh)");
        
        // Verificação temporal (evita spam)
        require(
            block.timestamp >= member.lastReportTimestamp + 1 hours, 
            "Must wait at least 1 hour between energy reports"
        );
        
        // Atualiza créditos (1 kWh = 1 crédito)
        uint256 creditsEarned = energyAmount;
        member.energyCredits += creditsEarned;
        member.lastReportTimestamp = block.timestamp;
        
        // Atualiza estatísticas globais
        totalEnergyProduced += energyAmount;
        totalEnergyCredits += creditsEarned;
        
        emit EnergyProduced(msg.sender, energyAmount, creditsEarned);
        
        // Monitorização de saúde sistémica
        _checkSystemBalance();
    }
    
    /**
     * @notice Função de emergência para reportar sensor com defeito
     * @param member Endereço do membro com problema no sensor
     * @dev Circuit breaker: suspende membros com muitos relatórios inválidos
     */
    function reportInvalidSensor(address member) external onlyMember {
        require(members[member].isRegistered, "Target is not a registered member");
        
        members[member].invalidReportsCount++;
        
        // Circuit breaker: suspende após 3 relatórios inválidos
        if (members[member].invalidReportsCount >= MAX_INVALID_REPORTS) {
            members[member].isTemporarilySuspended = true;
            emit MemberSuspended(member, block.timestamp + SUSPENSION_DURATION);
        }
    }
    
    // ============================================================================
    // FUNÇÕES DE TRANSFERÊNCIA COM CONSCIÊNCIA SISTÉMICA
    // ============================================================================
    
    /**
     * @notice Transfere créditos entre membros com precificação dinâmica
     * @param to Endereço do destinatário
     * @param amount Quantidade de créditos a transferir
     * @dev Implementa taxa dinâmica baseada no equilíbrio do sistema
     */
    function transferCredits(address to, uint256 amount) 
        external 
        onlyMember 
        validAmount(amount) 
        notSuspended(to) 
    {
        require(to != msg.sender, "Cannot transfer to self");
        require(members[to].isRegistered, "Recipient is not a registered member");
        require(members[msg.sender].energyCredits >= amount, "Insufficient energy credits");
        
        // Calcula taxa dinâmica baseada no desequilíbrio do sistema
        uint256 fee = _calculateDynamicFee(amount);
        uint256 netAmount = amount - fee;
        
        // Executa transferência
        members[msg.sender].energyCredits -= amount;
        members[to].energyCredits += netAmount;
        
        // Taxa vai para um pool comunitário (simplificado: "queimada")
        totalEnergyCredits -= fee;
        
        emit CreditsTransferred(msg.sender, to, netAmount, fee);
        
        // Monitorização sistémica pós-transferência
        _checkSystemBalance();
    }
    
    /**
     * @dev Calcula taxa dinâmica baseada no estado do sistema
     * @param amount Quantidade sendo transferida
     * @return Taxa a ser cobrada
     */
    function _calculateDynamicFee(uint256 amount) internal view returns (uint256) {
        // Taxa base
        uint256 fee = (amount * baseFeeRate) / 10000;
        
        // Ajuste baseado na concentração de créditos
        uint256 senderBalance = members[msg.sender].energyCredits;
        uint256 avgBalance = totalEnergyCredits / (memberCount > 0 ? memberCount : 1);
        
        // Se o remetente tem muito mais que a média, aumenta a taxa
        if (senderBalance > avgBalance * 3) {
            fee = (fee * 150) / 100; // +50%
        }
        
        return fee;
    }
    
    /**
     * @dev Monitoriza o equilíbrio sistémico e ajusta parâmetros
     */
    function _checkSystemBalance() internal {
        if (memberCount == 0) return;
        
        uint256 avgBalance = totalEnergyCredits / memberCount;
        uint256 threshold = avgBalance * 2;
        
        // Conta membros com saldo muito alto
        uint256 highBalanceMembers = 0;
        // Nota: Em implementação real, usaríamos um array de membros para iterar
        
        // Ajusta taxa base se há concentração excessiva
        if (highBalanceMembers > memberCount / 4) { // Mais de 25% com saldo alto
            if (baseFeeRate < MAX_FEE_RATE) {
                baseFeeRate += 50; // Aumenta taxa
                emit SystemBalanceAlert(totalEnergyCredits, totalEnergyProduced, baseFeeRate);
            }
        } else if (baseFeeRate > 100) {
            baseFeeRate -= 25; // Diminui taxa gradualmente
        }
    }
    
    // ============================================================================
    // FUNÇÕES DE CONSULTA
    // ============================================================================
    
    function getMemberInfo(address member) external view returns (
        bool isRegistered,
        uint256 energyCredits,
        uint256 invalidReportsCount,
        bool isTemporarilySuspended
    ) {
        Member storage m = members[member];
        return (m.isRegistered, m.energyCredits, m.invalidReportsCount, m.isTemporarilySuspended);
    }
    
    function getSystemStats() external view returns (
        uint256 totalProduced,
        uint256 totalCredits,
        uint256 totalMembers,
        uint256 currentFeeRate
    ) {
        return (totalEnergyProduced, totalEnergyCredits, memberCount, baseFeeRate);
    }
    
    // ============================================================================
    // SISTEMA DE GOVERNAÇÃO (METACOGNIÇÃO)
    // ============================================================================
    
    /**
     * @notice Cria uma nova proposta para votação da DAO
     * @param description Descrição detalhada da proposta
     * @return proposalId ID único da proposta criada
     * @dev Implementa governação descentralizada com período de votação fixo
     * 
     * Lógica Metacognitiva:
     * - Qualquer membro registado pode criar propostas (princípio democrático)
     * - Período de votação de 7 dias para permitir deliberação adequada
     * - IDs sequenciais para rastreabilidade e auditoria
     * - Emissão de eventos para transparência total
     */
    function createProposal(string calldata description) 
        external 
        onlyMember 
        returns (uint256 proposalId) 
    {
        require(bytes(description).length > 0, "Proposal description cannot be empty");
        require(bytes(description).length <= 500, "Proposal description too long (max 500 chars)");
        
        proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.yesVotes = 0;
        proposal.noVotes = 0;
        proposal.endTime = block.timestamp + 7 days; // Período de votação de 7 dias
        proposal.executed = false;
        
        emit ProposalCreated(proposalId, msg.sender, description);
        
        return proposalId;
    }
    
    /**
     * @notice Permite que um membro vote numa proposta
     * @param proposalId ID da proposta
     * @param support true para votar a favor, false para votar contra
     * @dev Implementa votação simples (1 membro = 1 voto) com proteções contra dupla votação
     * 
     * Lógica Metacognitiva:
     * - Verificação de existência da proposta e validade temporal
     * - Prevenção de dupla votação através de mapeamento
     * - Modelo democrático básico: cada membro tem igual poder de voto
     * - Transparência através de eventos detalhados
     * 
     * Limitações Conhecidas:
     * - Não considera stake/contribuição energética no peso do voto
     * - Vulnerável a ataques Sybil (criação de múltiplas identidades)
     * - Não implementa quórum mínimo para validade da votação
     */
    function vote(uint256 proposalId, bool support) external onlyMember {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id == proposalId, "Proposal does not exist");
        require(block.timestamp <= proposal.endTime, "Voting period has ended");
        require(!proposal.hasVoted[msg.sender], "Member has already voted on this proposal");
        require(!proposal.executed, "Proposal has already been executed");
        
        // Registra o voto
        proposal.hasVoted[msg.sender] = true;
        proposal.votePower[msg.sender] = 1; // Poder de voto unitário (modelo básico)
        
        if (support) {
            proposal.yesVotes += 1;
        } else {
            proposal.noVotes += 1;
        }
        
        emit VoteCast(proposalId, msg.sender, support, 1);
    }
    
    /**
     * @notice Executa uma proposta aprovada
     * @param proposalId ID da proposta a executar
     * @dev Implementa execução de propostas com verificação de aprovação
     * 
     * Lógica Metacognitiva:
     * - Execução apenas após período de votação
     * - Critério de aprovação: mais votos "sim" que "não"
     * - Prevenção de dupla execução
     * - Simplicidade intencional para transparência
     * 
     * Limitações Reconhecidas:
     * - Não implementa quórum mínimo (pode aprovar com poucos votos)
     * - Não há mecanismo de execução automática da lógica da proposta
     * - Execução é simbólica (marca como executada mas não implementa ação)
     */
    function executeProposal(uint256 proposalId) external returns (bool success) {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id == proposalId, "Proposal does not exist");
        require(block.timestamp > proposal.endTime, "Voting period has not ended");
        require(!proposal.executed, "Proposal has already been executed");
        
        // Verifica se a proposta foi aprovada (maioria simples)
        bool approved = proposal.yesVotes > proposal.noVotes;
        
        if (approved) {
            proposal.executed = true;
            emit ProposalExecuted(proposalId, true);
            
            // Nota: Em implementação real, aqui seria executada a lógica específica da proposta
            // Por exemplo: alterar parâmetros do contrato, transferir fundos, etc.
            
            return true;
        } else {
            emit ProposalExecuted(proposalId, false);
            return false;
        }
    }
    
    /**
     * @notice Consulta informações de uma proposta
     * @param proposalId ID da proposta
     * @return proposer Endereço do criador da proposta
     * @return description Descrição da proposta
     * @return yesVotes Número de votos a favor
     * @return noVotes Número de votos contra
     * @return endTime Timestamp do fim do período de votação
     * @return executed Status de execução da proposta
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory description,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 endTime,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id == proposalId, "Proposal does not exist");
        
        return (
            proposal.proposer,
            proposal.description,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.endTime,
            proposal.executed
        );
    }
    
    /**
     * @notice Verifica se um membro já votou numa proposta
     * @param proposalId ID da proposta
     * @param voter Endereço do membro
     * @return hasVoted true se já votou, false caso contrário
     */
    function hasVotedOnProposal(uint256 proposalId, address voter) external view returns (bool hasVoted) {
        return proposals[proposalId].hasVoted[voter];
    }
    
    // ============================================================================
    // SISTEMA DE VOTAÇÃO QUADRÁTICA (RESSONÂNCIA SEMÂNTICA)
    // ============================================================================
    
    /**
     * @notice Atualiza os créditos de votação de um membro baseado no tempo decorrido
     * @param member Endereço do membro
     * @dev Implementa distribuição mensal de créditos de votação
     * 
     * Filosofia da Ressonância Semântica:
     * Os créditos de votação representam "energia cívica" que se regenera periodicamente,
     * permitindo participação sustentada sem acumulação indefinida de poder.
     */
    function updateVotingCredits(address member) public {
        Member storage m = members[member];
        require(m.isRegistered, "Member not registered");
        
        uint256 monthsElapsed = (block.timestamp - m.lastVotingCreditsUpdate) / VOTING_CREDITS_INTERVAL;
        
        if (monthsElapsed > 0) {
            uint256 creditsToAdd = monthsElapsed * MONTHLY_VOTING_CREDITS;
            uint256 newCredits = m.votingCredits + creditsToAdd;
            
            // Limita o máximo de créditos acumulados
            if (newCredits > MAX_VOTING_CREDITS) {
                newCredits = MAX_VOTING_CREDITS;
            }
            
            m.votingCredits = newCredits;
            m.lastVotingCreditsUpdate = block.timestamp;
            
            emit VotingCreditsUpdated(member, newCredits, block.timestamp);
        }
    }
    
    /**
     * @notice Implementa votação quadrática com intensidade de preferência
     * @param proposalId ID da proposta
     * @param support true para votar a favor, false para votar contra  
     * @param intensity Intensidade do voto (1-10), custo quadrático
     * @dev Permite expressão nuançada de preferências através de custo progressivo
     * 
     * Ressonância Semântica com "Consenso Comunitário":
     * - Intensidade 1-3: Preferência fraca (baixo custo)
     * - Intensidade 4-7: Preferência moderada (custo médio)
     * - Intensidade 8-10: Preferência forte (alto custo)
     * 
     * O custo quadrático previne dominação por atores com muitos recursos,
     * favorecendo consensos amplos sobre preferências intensas de poucos.
     */
    function voteQuadratic(uint256 proposalId, bool support, uint256 intensity) 
        external 
        onlyMember 
    {
        require(intensity > 0 && intensity <= MAX_VOTE_INTENSITY, "Invalid intensity level (1-10)");
        
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id == proposalId, "Proposal does not exist");
        require(block.timestamp <= proposal.endTime, "Voting period has ended");
        require(!proposal.hasVoted[msg.sender], "Member has already voted on this proposal");
        require(!proposal.executed, "Proposal has already been executed");
        
        // Atualiza créditos de votação antes de votar
        updateVotingCredits(msg.sender);
        
        // Calcula custo quadrático
        uint256 cost = intensity * intensity;
        require(members[msg.sender].votingCredits >= cost, "Insufficient voting credits");
        
        // Deduz créditos e registra voto
        members[msg.sender].votingCredits -= cost;
        proposal.hasVoted[msg.sender] = true;
        proposal.votePower[msg.sender] = intensity;
        
        // Adiciona votos com peso da intensidade
        if (support) {
            proposal.yesVotes += intensity;
        } else {
            proposal.noVotes += intensity;
        }
        
        emit QuadraticVoteCast(proposalId, msg.sender, support, intensity, cost);
    }

    /**
     * @notice Permite que um relayer submeta um voto anónimo em nome de um membro
     * @param proposalId ID da proposta
     * @param voter Endereço do membro que está a votar
     * @param support true para votar a favor, false para votar contra
     * @param intensity Intensidade do voto (1-10), custo quadrático
     * @dev Chamada apenas pelo relayer para preservar a privacidade do votante.
     *
     * Ressonância Semântica com Privacidade:
     * Esta função permite a participação na governação sem expor publicamente
     * a identidade do votante, alinhando-se com os princípios de segurança
     * e privacidade da xx.network.
     */
    function anonymousVoteQuadratic(
        uint256 proposalId,
        address voter,
        bool support,
        uint256 intensity
    )
        external
        onlyRelayer
    {
        require(intensity > 0 && intensity <= MAX_VOTE_INTENSITY, "Invalid intensity level (1-10)");
        require(members[voter].isRegistered, "Voter is not a registered member");
        require(!members[voter].isTemporarilySuspended, "Voter is temporarily suspended");

        Proposal storage proposal = proposals[proposalId];
        require(proposal.id == proposalId, "Proposal does not exist");
        require(block.timestamp <= proposal.endTime, "Voting period has ended");
        require(!proposal.hasVoted[voter], "Member has already voted on this proposal");
        require(!proposal.executed, "Proposal has already been executed");

        // Atualiza créditos de votação antes de votar
        updateVotingCredits(voter);

        // Calcula custo quadrático
        uint256 cost = intensity * intensity;
        require(members[voter].votingCredits >= cost, "Insufficient voting credits");

        // Deduz créditos e registra voto
        members[voter].votingCredits -= cost;
        proposal.hasVoted[voter] = true;
        proposal.votePower[voter] = intensity;

        // Adiciona votos com peso da intensidade
        if (support) {
            proposal.yesVotes += intensity;
        } else {
            proposal.noVotes += intensity;
        }

        emit AnonymousVoteCast(proposalId, voter, support, intensity, cost);
    }
    
    /**
     * @notice Calcula o custo de um voto com determinada intensidade
     * @param intensity Intensidade desejada (1-10)
     * @return cost Custo em créditos de votação
     * @dev Função utilitária para interface frontend
     */
    function calculateVoteCost(uint256 intensity) external pure returns (uint256 cost) {
        require(intensity > 0 && intensity <= MAX_VOTE_INTENSITY, "Invalid intensity level");
        return intensity * intensity;
    }
    
    /**
     * @notice Obtém informações de créditos de votação de um membro
     * @param member Endereço do membro
     * @return currentCredits Créditos atuais
     * @return maxCredits Máximo de créditos possível
     * @return monthsUntilNext Meses até próxima distribuição
     */
    function getVotingCreditsInfo(address member) external view returns (
        uint256 currentCredits,
        uint256 maxCredits,
        uint256 monthsUntilNext
    ) {
        Member storage m = members[member];
        require(m.isRegistered, "Member not registered");
        
        uint256 timeSinceUpdate = block.timestamp - m.lastVotingCreditsUpdate;
        uint256 monthsElapsed = timeSinceUpdate / VOTING_CREDITS_INTERVAL;
        uint256 timeToNext = VOTING_CREDITS_INTERVAL - (timeSinceUpdate % VOTING_CREDITS_INTERVAL);
        
        // Calcula créditos atualizados sem modificar o estado
        uint256 creditsToAdd = monthsElapsed * MONTHLY_VOTING_CREDITS;
        uint256 updatedCredits = m.votingCredits + creditsToAdd;
        if (updatedCredits > MAX_VOTING_CREDITS) {
            updatedCredits = MAX_VOTING_CREDITS;
        }
        
        return (
            updatedCredits,
            MAX_VOTING_CREDITS,
            timeToNext / (1 days) // Retorna em dias para facilitar UI
        );
    }
    
    /**
     * @notice Permite que um membro doe créditos de votação para outro
     * @param to Destinatário dos créditos
     * @param amount Quantidade de créditos a doar
     * @dev Implementa solidariedade cívica e redistribuição voluntária de poder
     * 
     * Ressonância Semântica:
     * Esta função manifesta o valor de "solidariedade comunitária" - membros
     * com créditos excedentes podem empoderar outros com menor participação.
     */
    function donateVotingCredits(address to, uint256 amount) 
        external 
        onlyMember 
        validAmount(amount) 
    {
        require(to != msg.sender, "Cannot transfer to self");
        require(members[to].isRegistered, "Recipient is not a registered member");
        require(!members[to].isTemporarilySuspended, "Recipient is suspended");
        
        // Atualiza créditos de ambos os membros
        updateVotingCredits(msg.sender);
        updateVotingCredits(to);
        
        require(members[msg.sender].votingCredits >= amount, "Insufficient voting credits to donate");
        
        // Verifica se o destinatário não excederá o máximo
        uint256 recipientNewCredits = members[to].votingCredits + amount;
        require(recipientNewCredits <= MAX_VOTING_CREDITS, "Donation would exceed recipient's credit limit");
        
        // Executa transferência
        members[msg.sender].votingCredits -= amount;
        members[to].votingCredits += amount;
        
        emit VotingCreditsUpdated(msg.sender, members[msg.sender].votingCredits, block.timestamp);
        emit VotingCreditsUpdated(to, members[to].votingCredits, block.timestamp);
    }

    function rescueTokens(address tokenAddress, address to, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).transfer(to, amount);
    }
}