'use client';

import { SystemHealth } from '@/types/energyGrid';

interface EquityIndexProps {
  health?: SystemHealth['equity'];
}

export default function EquityIndex({ health }: EquityIndexProps) {
  if (!health) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const { giniCoefficient, averageBalance, medianBalance, distributionHealth } = health;
  
  // Converte Gini para "Índice de Equidade" (0% = desigualdade máxima, 100% = equidade perfeita)
  const equityScore = Math.round((1 - giniCoefficient) * 100);
  
  // Calcula diferença entre média e mediana (indicador de concentração)
  const averageNum = Number(averageBalance);
  const medianNum = Number(medianBalance);
  const concentration = averageNum > 0 ? Math.abs(averageNum - medianNum) / averageNum : 0;

  const getEquityColor = (): string => {
    if (equityScore >= 70) return 'text-cyan-600';
    if (equityScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEquityBackground = (): string => {
    if (equityScore >= 70) return 'bg-cyan-100';
    if (equityScore >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getDistributionIcon = () => {
    switch (distributionHealth) {
      case 'balanced':
        return (
          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'concentrated':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      case 'critical':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  const formatBalance = (balance: bigint): string => {
    const num = Number(balance);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Medidor Principal de Equidade */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getEquityBackground()} border-4 border-current ${getEquityColor()}`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getEquityColor()}`}>
              {equityScore}%
            </div>
            <div className="text-sm text-gray-600">Equidade</div>
          </div>
        </div>
      </div>

      {/* Métricas de Distribuição */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-blue-700">
            {formatBalance(averageBalance)}
          </div>
          <div className="text-sm text-blue-600">Saldo Médio</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-purple-700">
            {formatBalance(medianBalance)}
          </div>
          <div className="text-sm text-purple-600">Saldo Mediano</div>
        </div>
      </div>

      {/* Coeficiente de Gini */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-gray-800">Coeficiente de Gini</div>
          <div className="text-lg font-bold text-gray-700">
            {giniCoefficient.toFixed(3)}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${giniCoefficient < 0.4 ? 'bg-green-500' : giniCoefficient < 0.7 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${giniCoefficient * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          0 = Equidade Perfeita • 1 = Desigualdade Máxima
        </div>
      </div>

      {/* Estado da Distribuição */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-800">Estado da Distribuição</div>
            <div className="text-sm text-gray-600 capitalize">
              {distributionHealth === 'balanced' ? 'Equilibrada' : 
               distributionHealth === 'concentrated' ? 'Concentrada' : 'Crítica'}
            </div>
          </div>
          {getDistributionIcon()}
        </div>
      </div>

      {/* Interpretação Eudaimónica */}
      <div className="bg-cyan-50 rounded-lg p-4 border-l-4 border-cyan-400">
        <div className="text-sm">
          <div className="font-semibold text-cyan-800 mb-1">
            Princípio da Simbiose
          </div>
          <div className="text-cyan-700">
            {distributionHealth === 'balanced' ? (
              "A comunidade demonstra distribuição equilibrada de recursos, promovendo simbiose saudável."
            ) : distributionHealth === 'concentrated' ? (
              "Há sinais de concentração. Considere mecanismos de redistribuição para melhorar a simbiose."
            ) : (
              "A distribuição crítica requer intervenção imediata para restaurar o equilíbrio simbiótico."
            )}
          </div>
        </div>
      </div>

      {/* Visualização da Concentração */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Diferença Média-Mediana</span>
          <span>{(concentration * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              concentration < 0.1 ? 'bg-cyan-500' : 
              concentration < 0.3 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(concentration * 100, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600">
          Menor diferença indica distribuição mais equilibrada
        </div>
      </div>
    </div>
  );
}