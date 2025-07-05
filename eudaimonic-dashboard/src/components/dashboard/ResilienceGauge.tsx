'use client';

import { SystemHealth } from '@/types/energyGrid';

interface ResilienceGaugeProps {
  health?: SystemHealth['resilience'];
}

export default function ResilienceGauge({ health }: ResilienceGaugeProps) {
  if (!health) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const { activeMembers, suspendedMembers, contractUptime, networkStability } = health;
  const totalMembers = activeMembers + suspendedMembers;
  const healthPercentage = Math.round(contractUptime);

  // Calcula cor baseada na saúde
  const getHealthColor = (): string => {
    if (contractUptime >= 95) return 'text-green-600';
    if (contractUptime >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBackground = (): string => {
    if (contractUptime >= 95) return 'bg-green-100';
    if (contractUptime >= 85) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStabilityIcon = () => {
    switch (networkStability) {
      case 'high':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Medidor Principal de Uptime */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getHealthBackground()} border-4 border-current ${getHealthColor()}`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getHealthColor()}`}>
              {healthPercentage}%
            </div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
        </div>
      </div>

      {/* Métricas de Membros */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-700">
            {activeMembers}
          </div>
          <div className="text-sm text-emerald-600">Membros Ativos</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-700">
            {suspendedMembers}
          </div>
          <div className="text-sm text-red-600">Suspensos</div>
        </div>
      </div>

      {/* Estabilidade da Rede */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-800">Estabilidade da Rede</div>
            <div className="text-sm text-gray-600 capitalize">
              {networkStability === 'high' ? 'Alta' : networkStability === 'medium' ? 'Média' : 'Baixa'}
            </div>
          </div>
          {getStabilityIcon()}
        </div>
      </div>

      {/* Interpretação Eudaimónica */}
      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
        <div className="text-sm">
          <div className="font-semibold text-blue-800 mb-1">
            Princípio da Autopoiese
          </div>
          <div className="text-blue-700">
            {contractUptime >= 95 ? (
              "O sistema demonstra forte capacidade de auto-regeneração e manutenção."
            ) : contractUptime >= 85 ? (
              "O sistema mantém estabilidade, mas pode beneficiar de otimizações."
            ) : (
              "O sistema requer atenção imediata para restaurar sua autopoiese."
            )}
          </div>
        </div>
      </div>

      {/* Barra de Progresso da Saúde */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Saúde Autopoiética</span>
          <span>{healthPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              contractUptime >= 95 ? 'bg-green-500' : 
              contractUptime >= 85 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}