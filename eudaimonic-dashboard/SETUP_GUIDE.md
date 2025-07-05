# Dashboard Sistémico Eudaimónico
## Guia de Configuração e Filosofia de Design

### Visão Geral Filosófica

Este dashboard não é apenas uma interface para visualizar dados - é um **espelho da saúde sistémica** que reflete os princípios fundamentais da Engenharia Eudaimónica:

#### 🔄 **Autopoiese** (ResilienceGauge)
- **Princípio**: Capacidade de auto-regeneração e manutenção da integridade sistémica
- **Implementação**: Medidor que monitora a resiliência da rede através de métricas como membros ativos, uptime do contrato e estabilidade da rede
- **UI**: Estados claros de loading/success/error que comunicam a saúde do sistema

#### 🤝 **Simbiose** (EquityIndex) 
- **Princípio**: Interdependência harmoniosa e distribuição equilibrada de recursos
- **Implementação**: Visualizador do Coeficiente de Gini que mostra a equidade na distribuição de créditos energéticos
- **UI**: Indicadores visuais que promovem transparência sobre a saúde económica do ecossistema

#### 🧠 **Metacognição** (GovernanceActivity)
- **Princípio**: Consciência coletiva e capacidade de auto-reflexão do sistema
- **Implementação**: Feed em tempo real das propostas e decisões da DAO
- **UI**: Transparência total dos processos democráticos e participação coletiva

#### 🌐 **Ressonância Semântica** (PersonalActionPanel)
- **Princípio**: Alinhamento de ações individuais com o propósito coletivo
- **Implementação**: Interface onde cada ação do utilizador ressoa através de todo o ecossistema
- **UI**: Feedback imediato sobre o impacto das ações pessoais no sistema global

### Configuração Técnica

#### Pré-requisitos
```bash
# Node.js 18+ e npm
node --version
npm --version

# MetaMask ou wallet compatível
# Rede local Ethereum (Hardhat/Ganache) ou testnet
```

#### 1. Instalação de Dependências
```bash
cd eudaimonic-dashboard
npm install
```

#### 2. Configuração do Ambiente
```bash
# Copiar arquivo de configuração
cp .env.example .env.local

# Editar .env.local com suas configurações
nano .env.local
```

#### 3. Configuração da Blockchain

##### Para Desenvolvimento Local:
```bash
# Terminal 1: Iniciar rede local (Hardhat)
npx hardhat node

# Terminal 2: Deploy do contrato
npx hardhat deploy --network localhost

# Copiar o endereço do contrato para .env.local
```

##### Para Testnet:
```bash
# Configurar .env.local com:
NEXT_PUBLIC_CONTRACT_ADDRESS=0x[seu_contrato_address]
NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia testnet
```

#### 4. Inicialização do Dashboard
```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Estrutura da Aplicação

```
src/
├── app/
│   ├── page.tsx              # Dashboard principal - orquestração dos princípios
│   ├── layout.tsx            # Layout base com providers
│   └── globals.css           # Estilos globais eudaimónicos
├── components/
│   ├── dashboard/
│   │   ├── ResilienceGauge.tsx      # Autopoiese: Medidor de resiliência
│   │   ├── EquityIndex.tsx          # Simbiose: Índice de equidade
│   │   ├── GovernanceActivity.tsx   # Metacognição: Feed de governança
│   │   ├── PersonalActionPanel.tsx  # Ressonância: Interface de ação
│   │   └── SystemPulse.tsx          # Pulso vital do sistema
│   └── ui/
│       └── ConnectWallet.tsx        # Conexão com wallet
├── services/
│   └── blockchainService.ts         # Ponte entre mundo digital e físico
└── types/
    └── energyGrid.ts               # Definições de tipos sistémicos
```

### Componentes Principais

#### 1. **Dashboard Principal** (`app/page.tsx`)
- **Filosofia**: Centro nervoso que orquestra todos os princípios eudaimónicos
- **Responsabilidades**: 
  - Gerenciamento de estado sistémico
  - Sincronização em tempo real
  - Coordenação entre componentes

#### 2. **ResilienceGauge** (Autopoiese)
- **Métricas Monitoradas**:
  - Membros ativos vs. suspensos
  - Uptime do contrato inteligente
  - Estabilidade da rede
- **Estados Visuais**: High/Medium/Low com cores e animações correspondentes

#### 3. **EquityIndex** (Simbiose)
- **Indicadores**:
  - Coeficiente de Gini dos créditos
  - Distribuição de saldos
  - Saúde económica ("balanced", "concentrated", "critical")

#### 4. **GovernanceActivity** (Metacognição)
- **Funcionalidades**:
  - Lista de propostas ativas
  - Histórico de votações
  - Taxa de participação comunitária

#### 5. **PersonalActionPanel** (Ressonância Semântica)
- **Ações Disponíveis**:
  - Reportar produção de energia
  - Criar e votar em propostas
  - Transferir créditos energéticos
  - Doar créditos de votação

### Interação com Smart Contract

O serviço `blockchainService.ts` implementa todas as interações com o contrato `EnergyGridDAO.sol`:

#### Funções de Leitura:
- `getMemberInfo()` - Informações do membro
- `getSystemStats()` - Estatísticas globais
- `getProposal()` - Detalhes de propostas
- `calculateSystemHealth()` - Saúde sistémica completa

#### Funções de Escrita:
- `registerMember()` - Registro de novos membros
- `reportEnergyProduction()` - Reporte de energia
- `voteQuadratic()` - Votação com intensidade
- `transferCredits()` - Transferências de créditos
- `donateVotingCredits()` - Doações solidárias

### Princípios de Design UX

#### **1. Feedback Imediato** (Autopoiese)
- Estados claros de loading, success e error
- Nunca deixar o utilizador em incerteza
- Comunicação robusta de todos os processos

#### **2. Transparência Estrutural** (Simbiose)
- Todas as métricas sistémicas visíveis
- Impacto das ações individuais no coletivo
- Incentivo à colaboração através da visibilidade

#### **3. Consciência Coletiva** (Metacognição)
- Feed em tempo real das decisões comunitárias
- Histórico transparente de governança
- Participação democrática facilitada

#### **4. Impacto Ressonante** (Ressonância Semântica)
- Feedback sobre como as ações pessoais afetam o ecossistema
- Interface intuitiva para participação ativa
- Gamificação sutil que encoraja contribuições positivas

### Próximos Passos de Desenvolvimento

1. **Integração IoT**: Conectar sensores reais de energia
2. **Sistema de Notificações**: Alertas sobre eventos importantes
3. **Analytics Avançados**: Métricas mais sofisticadas de saúde sistémica
4. **Mobile App**: Versão móvel do dashboard
5. **Integração Social**: Recursos de comunidade e comunicação

### Troubleshooting

#### Problema: "Contract not found"
```bash
# Verificar se o contrato foi deployado
# Verificar endereço em .env.local
# Verificar se a rede está configurada corretamente
```

#### Problema: "MetaMask connection failed"
```bash
# Verificar se MetaMask está instalado
# Verificar se está na rede correta
# Refresh da página e reconectar wallet
```

#### Problema: "Transaction failed"
```bash
# Verificar saldo de ETH para gas
# Verificar se é membro registrado
# Verificar parâmetros da transação
```

### Contribuição ao Projeto

Para contribuir com melhorias:
1. Fork do repositório
2. Criar branch para feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit com mensagens descritivas seguindo princípios eudaimónicos
4. Submeter Pull Request com explicação filosófica da mudança

---

*"Onde a tecnologia encontra a sabedoria, e a energia flui em harmonia"* - Filosofia Eudaimónica