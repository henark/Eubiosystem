// TIPOS PARA BACKEND IoT - ENGENHARIA EUDAIMÓNICA
// Implementa princípios de Autopoiese (robustez) e Transparência Estrutural

export interface EnergyReportRequest {
  deviceId: string;
  energyProduced: number; // kWh
  timestamp: number;
  signature?: string; // Para validação de integridade
  metadata?: {
    voltage?: number;
    current?: number;
    powerFactor?: number;
    temperature?: number;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface EnergyReportResponse {
  success: boolean;
  transactionHash?: string;
  message: string;
  reportId: string;
  timestamp: number;
  validationStatus: ValidationStatus;
}

export enum ValidationStatus {
  VALID = 'valid',
  SUSPICIOUS = 'suspicious',
  INVALID = 'invalid',
  PENDING = 'pending'
}

export interface DeviceInfo {
  deviceId: string;
  address: string; // Endereço Ethereum do dispositivo
  apiKey: string;
  lastReport?: number;
  isActive: boolean;
  totalReports: number;
  invalidReportsCount: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface SystemHealth {
  uptime: number;
  totalReports: number;
  validReports: number;
  invalidReports: number;
  averageResponseTime: number;
  blockchainConnectionStatus: 'connected' | 'disconnected' | 'error';
  lastBlockchainInteraction?: number;
}

export interface ValidationRules {
  maxEnergyReportKWh: number;
  minEnergyReportKWh: number;
  reportCooldownMinutes: number;
  maxDailyReports: number;
  suspiciousThresholdMultiplier: number;
}

export interface BlockchainConfig {
  rpcUrl: string;
  contractAddress: string;
  privateKeyVaultUrl?: string;
  gasLimit: number;
  maxGasPrice: string;
}

export interface SecurityConfig {
  apiSecretKey: string;
  deviceApiKeys: Map<string, string>;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  enableEncryption: boolean;
}

// Estados para Autopoiese (Sistema Imunitário)
export enum SystemState {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  CRITICAL = 'critical',
  RECOVERY = 'recovery'
}

export interface IncidentReport {
  id: string;
  type: 'security' | 'validation' | 'blockchain' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
  deviceId?: string;
  resolved: boolean;
  metadata?: Record<string, any>;
}

// Interface para logs estruturados (Metacognição)
export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: number;
  component: string;
  metadata?: Record<string, any>;
  deviceId?: string;
  transactionHash?: string;
}