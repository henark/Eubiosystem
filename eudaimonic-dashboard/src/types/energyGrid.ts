// TIPOS FUNDAMENTAIS DA ENGENHARIA EUDAIMÓNICA
// Autopoiese: Tipos auto-consistentes e robustos
// Simbiose: Interfaces que promovem interação harmoniosa
// Metacognição: Tipos que facilitam introspecção sistémica
// Ressonância Semântica: Significado claro e expressivo

export interface Member {
  address: string;
  isRegistered: boolean;
  energyCredits: bigint;
  invalidReportsCount: number;
  isTemporarilySuspended: boolean;
  lastReportTimestamp: bigint;
  votingCredits: bigint;
  lastVotingCreditsUpdate: bigint;
}

export interface Proposal {
  id: bigint;
  proposer: string;
  description: string;
  yesVotes: bigint;
  noVotes: bigint;
  endTime: bigint;
  executed: boolean;
}

export interface SystemStats {
  totalProduced: bigint;
  totalCredits: bigint;
  totalMembers: bigint;
  currentFeeRate: bigint;
}

export interface VotingCreditsInfo {
  currentCredits: bigint;
  maxCredits: bigint;
  monthsUntilNext: bigint;
}

// Estados de UI para Autopoiese (Feedback Claro ao Utilizador)
export type TransactionState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; txHash: string }
  | { status: 'error'; error: string };

// Métricas de Saúde Sistémica (Dashboard Eudaimónico)
export interface SystemHealth {
  // Medidor de Resiliência (Autopoiese)
  resilience: {
    activeMembers: number;
    suspendedMembers: number;
    contractUptime: number; // percentagem
    networkStability: 'high' | 'medium' | 'low';
  };
  
  // Índice de Equidade (Simbiose)
  equity: {
    giniCoefficient: number; // 0 = equidade perfeita, 1 = desigualdade máxima
    averageBalance: bigint;
    medianBalance: bigint;
    distributionHealth: 'balanced' | 'concentrated' | 'critical';
  };
  
  // Feed de Atividade da Governança (Metacognição)
  governance: {
    activeProposals: number;
    recentProposals: Proposal[];
    participationRate: number; // percentagem de membros que votam
    consensusLevel: 'high' | 'medium' | 'low'; // baseado na margem de vitória
  };
  
  // Indicadores de Ressonância Semântica
  resonance: {
    communityEngagement: number; // 0-100
    votingCreditsDistribution: 'healthy' | 'concentrated' | 'depleted';
    collaborationIndex: number; // baseado em doações e transferências
  };
}

// Eventos da Blockchain para Consciência em Tempo Real
export interface EnergyGridEvent {
  type: 'EnergyProduced' | 'CreditsTransferred' | 'VoteCast' | 'ProposalCreated' | 'MemberRegistered';
  timestamp: Date;
  data: any;
  impact: 'positive' | 'neutral' | 'warning' | 'critical';
}

// Interface para Actions do Painel de Ação Pessoal
export interface PersonalActions {
  vote: (proposalId: bigint, support: boolean) => Promise<string>;
  voteQuadratic: (proposalId: bigint, support: boolean, intensity: number) => Promise<string>;
  transferCredits: (to: string, amount: bigint) => Promise<string>;
  donateVotingCredits: (to: string, amount: bigint) => Promise<string>;
  reportEnergyProduction: (amount: bigint) => Promise<string>;
  createProposal: (description: string) => Promise<string>;
}

// Estados Conectivos para Ressonância Semântica
export interface ConnectionState {
  isConnected: boolean;
  address?: string;
  isRegisteredMember: boolean;
  memberInfo?: Member;
  networkHealth: 'connected' | 'syncing' | 'disconnected' | 'error';
}