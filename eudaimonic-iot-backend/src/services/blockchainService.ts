// SERVIÇO DE BLOCKCHAIN - PONTE SEGURA IoT ↔ BLOCKCHAIN
// Implementa Autopoiese (recuperação de falhas) e Transparência Estrutural

import { ethers } from 'ethers';
import { BlockchainConfig, ValidationStatus, LogEntry } from '../types';
import { logger } from '../utils/logger';

// ABI simplificado do contrato EnergyGridDAO
const ENERGY_GRID_ABI = [
  "function reportEnergyProduction(uint256 energyAmount) external",
  "function getMemberInfo(address member) external view returns (bool isRegistered, uint256 energyCredits, uint256 invalidReportsCount, bool isTemporarilySuspended)",
  "function getSystemStats() external view returns (uint256 totalProduced, uint256 totalCredits, uint256 totalMembers, uint256 currentFeeRate)"
];

export class BlockchainService {
  private provider!: ethers.JsonRpcProvider;
  private contract!: ethers.Contract;
  private wallet!: ethers.Wallet;
  private config: BlockchainConfig;
  private connectionHealthy: boolean = false;
  private lastSuccessfulInteraction: number = 0;
  private retryCount: number = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 5000;

  constructor(config: BlockchainConfig) {
    this.config = config;
    this.initializeConnection();
  }

  /**
   * Inicializa conexão com blockchain seguindo princípio da Autopoiese
   */
  private async initializeConnection(): Promise<void> {
    try {
      // Conexão com RPC provider
      this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
      
      // TODO: Em produção, buscar chave privada do Vault de forma segura
      const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || 
        '0x0000000000000000000000000000000000000000000000000000000000000001'; // NUNCA usar em produção!
      
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      
      // Inicializar contrato
      this.contract = new ethers.Contract(
        this.config.contractAddress,
        ENERGY_GRID_ABI,
        this.wallet
      );

      // Testar conexão
      await this.healthCheck();
      
      logger.info('Blockchain service initialized successfully', {
        component: 'BlockchainService',
        contractAddress: this.config.contractAddress,
        networkName: await this.provider.getNetwork().then(n => n.name)
      });

    } catch (error) {
      logger.error('Failed to initialize blockchain connection', {
        component: 'BlockchainService',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Verifica saúde da conexão blockchain (Autopoiese)
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      const balance = await this.provider.getBalance(this.wallet.address);
      
      this.connectionHealthy = true;
      this.lastSuccessfulInteraction = Date.now();
      this.retryCount = 0;

      logger.debug('Blockchain health check successful', {
        component: 'BlockchainService',
        blockNumber,
        walletBalance: ethers.formatEther(balance)
      });

      return true;
    } catch (error) {
      this.connectionHealthy = false;
      logger.warn('Blockchain health check failed', {
        component: 'BlockchainService',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Reporta produção de energia com retry automático (Autopoiese)
   */
  public async reportEnergyProduction(
    deviceAddress: string, 
    energyAmount: number
  ): Promise<string> {
    const logContext = {
      component: 'BlockchainService',
      deviceAddress,
      energyAmount,
      attempt: this.retryCount + 1
    };

    try {
      // Verificar se dispositivo está registrado e ativo
      const memberInfo = await this.checkMemberStatus(deviceAddress);
      if (!memberInfo.isRegistered) {
        throw new Error('Device not registered as member');
      }
      if (memberInfo.isTemporarilySuspended) {
        throw new Error('Device is temporarily suspended');
      }

      // Converter para Wei (assumindo 1 kWh = 1 token)
      const energyAmountWei = ethers.parseUnits(energyAmount.toString(), 18);

      // Estimar gas
      const gasEstimate = await this.contract.reportEnergyProduction.estimateGas(energyAmountWei);
      const gasLimit = gasEstimate * BigInt(120) / BigInt(100); // +20% buffer

      // Executar transação
      const tx = await this.contract.reportEnergyProduction(energyAmountWei, {
        gasLimit,
        maxFeePerGas: ethers.parseUnits(this.config.maxGasPrice, 'gwei')
      });

      logger.info('Energy production transaction sent', {
        ...logContext,
        transactionHash: tx.hash,
        gasUsed: gasLimit.toString()
      });

      // Aguardar confirmação
      const receipt = await tx.wait();
      
      this.lastSuccessfulInteraction = Date.now();
      this.retryCount = 0;

      logger.info('Energy production transaction confirmed', {
        ...logContext,
        transactionHash: receipt?.hash,
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString()
      });

      return receipt?.hash || tx.hash;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error('Failed to report energy production', {
        ...logContext,
        error: errorMessage
      });

      // Retry automático em caso de falha (Autopoiese)
      if (this.retryCount < this.MAX_RETRIES && this.isRetryableError(error)) {
        this.retryCount++;
        logger.warn('Retrying energy production report', {
          ...logContext,
          retryDelay: this.RETRY_DELAY_MS
        });
        
        await this.delay(this.RETRY_DELAY_MS);
        return this.reportEnergyProduction(deviceAddress, energyAmount);
      }

      this.retryCount = 0;
      throw new Error(`Blockchain transaction failed: ${errorMessage}`);
    }
  }

  /**
   * Verifica status de membro no contrato
   */
  public async checkMemberStatus(memberAddress: string): Promise<{
    isRegistered: boolean;
    energyCredits: bigint;
    invalidReportsCount: bigint;
    isTemporarilySuspended: boolean;
  }> {
    try {
      const result = await this.contract.getMemberInfo(memberAddress);
      return {
        isRegistered: result[0],
        energyCredits: result[1],
        invalidReportsCount: result[2],
        isTemporarilySuspended: result[3]
      };
    } catch (error) {
      logger.error('Failed to check member status', {
        component: 'BlockchainService',
        memberAddress,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Obtém estatísticas do sistema
   */
  public async getSystemStats(): Promise<{
    totalProduced: bigint;
    totalCredits: bigint;
    totalMembers: bigint;
    currentFeeRate: bigint;
  }> {
    try {
      const result = await this.contract.getSystemStats();
      return {
        totalProduced: result[0],
        totalCredits: result[1],
        totalMembers: result[2],
        currentFeeRate: result[3]
      };
    } catch (error) {
      logger.error('Failed to get system stats', {
        component: 'BlockchainService',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Verifica se erro é recuperável (para retry automático)
   */
  private isRetryableError(error: any): boolean {
    const retryableErrors = [
      'network error',
      'timeout',
      'connection refused',
      'insufficient gas',
      'nonce too low',
      'replacement transaction underpriced'
    ];

    const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
    return retryableErrors.some(retryableError => errorMessage.includes(retryableError));
  }

  /**
   * Delay utilitário para retry
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Getters para monitorização
   */
  public isHealthy(): boolean {
    return this.connectionHealthy;
  }

  public getLastSuccessfulInteraction(): number {
    return this.lastSuccessfulInteraction;
  }

  public getRetryCount(): number {
    return this.retryCount;
  }
}