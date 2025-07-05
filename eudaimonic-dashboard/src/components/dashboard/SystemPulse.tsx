'use client';

import { SystemHealth } from '@/types/energyGrid';

interface SystemPulseProps {
  health: SystemHealth | null;
  lastUpdate: Date;
  networkHealth: 'connected' | 'syncing' | 'disconnected' | 'error';
}

export default function SystemPulse({ health, lastUpdate, networkHealth }: SystemPulseProps) {
  // Calcula a "saúde geral" do sistema baseado nos princípios Eudaimónicos
  const calculateOverallHealth = (): number => {
    if (!health) return 0;
    
    const resilienceScore = health.resilience.contractUptime / 100;
    const equityScore = 1 - health.equity.giniCoefficient; // Inverte para que menor Gini = melhor
    const governanceScore = health.governance.participationRate / 100;
    const resonanceScore = health.resonance.communityEngagement / 100;
    
    return (resilienceScore + equityScore + governanceScore + resonanceScore) / 4;
  };

  const overallHealth = calculateOverallHealth();
  const healthPercentage = Math.round(overallHealth * 100);
  
  // Determina a cor baseada na saúde geral
  const getHealthColor = (): string => {
    if (networkHealth !== 'connected') return 'text-red-500';
    if (overallHealth >= 0.8) return 'text-green-500';
    if (overallHealth >= 0.6) return 'text-yellow-500';
    if (overallHealth >= 0.4) return 'text-orange-500';
    return 'text-red-500';
  };

  // Animação do pulso baseada na saúde
  const getPulseAnimation = (): string => {
    if (networkHealth !== 'connected') return 'animate-pulse';
    if (overallHealth >= 0.8) return 'animate-pulse';
    if (overallHealth >= 0.6) return 'animate-bounce';
    return 'animate-ping';
  };

  const getStatusText = (): string => {
    if (networkHealth !== 'connected') return 'Desconectado';
    if (overallHealth >= 0.8) return 'Sistema Saudável';
    if (overallHealth >= 0.6) return 'Sistema Estável';
    if (overallHealth >= 0.4) return 'Requer Atenção';
    return 'Estado Crítico';
  };

  const timeSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);

  return (
    <div className="flex items-center space-x-3">
      {/* Pulso Visual */}
      <div className="relative">
        <div className={`w-6 h-6 rounded-full ${getHealthColor().replace('text-', 'bg-')} ${getPulseAnimation()}`}></div>
        <div className={`absolute top-0 left-0 w-6 h-6 rounded-full ${getHealthColor().replace('text-', 'bg-')} opacity-20 animate-ping`}></div>
      </div>

      {/* Informações de Status */}
      <div className="text-right">
        <div className={`text-sm font-semibold ${getHealthColor()}`}>
          {getStatusText()}
        </div>
        <div className="text-xs text-emerald-600">
          {health ? `${healthPercentage}%` : 'Carregando...'}
          {timeSinceUpdate < 60 ? ` • ${timeSinceUpdate}s` : ` • ${Math.floor(timeSinceUpdate / 60)}m`}
        </div>
      </div>

      {/* Tooltip detalhado */}
      <div className="group relative">
        <svg className="w-5 h-5 text-emerald-500 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        {/* Tooltip Content */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white p-3 rounded-lg shadow-lg w-64 z-10">
          <div className="text-xs">
            <div className="font-semibold mb-2">Saúde Sistémica Detalhada:</div>
            {health && (
              <>
                <div className="mb-1">
                  <span className="text-green-400">Resiliência:</span> {Math.round(health.resilience.contractUptime)}%
                </div>
                <div className="mb-1">
                  <span className="text-cyan-400">Equidade:</span> {Math.round((1 - health.equity.giniCoefficient) * 100)}%
                </div>
                <div className="mb-1">
                  <span className="text-purple-400">Governança:</span> {health.governance.participationRate}%
                </div>
                <div className="mb-1">
                  <span className="text-amber-400">Ressonância:</span> {health.resonance.communityEngagement}%
                </div>
              </>
            )}
            <div className="mt-2 pt-2 border-t border-gray-600 text-gray-300">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}