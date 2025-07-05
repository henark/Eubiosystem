'use client';

import { SystemHealth, EnergyGridEvent } from '@/types/energyGrid';

interface GovernanceActivityProps {
  governance?: SystemHealth['governance'];
  recentEvents: EnergyGridEvent[];
}

export default function GovernanceActivity({ governance, recentEvents }: GovernanceActivityProps) {
  if (!governance) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const { activeProposals, recentProposals, participationRate, consensusLevel } = governance;

  const getConsensusColor = (): string => {
    switch (consensusLevel) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConsensusIcon = () => {
    switch (consensusLevel) {
      case 'high':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  const getEventIcon = (type: EnergyGridEvent['type']) => {
    switch (type) {
      case 'ProposalCreated':
        return (
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'VoteCast':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        );
      case 'EnergyProduced':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'CreditsTransferred':
        return (
          <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'MemberRegistered':
        return (
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getEventTypeText = (type: EnergyGridEvent['type']): string => {
    switch (type) {
      case 'ProposalCreated': return 'Nova Proposta';
      case 'VoteCast': return 'Voto Registrado';
      case 'EnergyProduced': return 'Energia Produzida';
      case 'CreditsTransferred': return 'Transferência';
      case 'MemberRegistered': return 'Novo Membro';
      default: return 'Evento';
    }
  };

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };

  return (
    <div className="space-y-6">
      {/* Métricas de Participação */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">
            {activeProposals}
          </div>
          <div className="text-sm text-purple-600">Propostas Ativas</div>
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-indigo-700">
            {participationRate}%
          </div>
          <div className="text-sm text-indigo-600">Participação</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-1">
            {getConsensusIcon()}
          </div>
          <div className={`text-sm font-semibold ${getConsensusColor()}`}>
            {consensusLevel === 'high' ? 'Alto' : consensusLevel === 'medium' ? 'Médio' : 'Baixo'}
          </div>
          <div className="text-xs text-gray-600">Consenso</div>
        </div>
      </div>

      {/* Barra de Participação */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Taxa de Participação</span>
          <span>{participationRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              participationRate >= 70 ? 'bg-green-500' : 
              participationRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${participationRate}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600">
          Meta: ≥70% para consenso saudável
        </div>
      </div>

      {/* Feed de Eventos Recentes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4V4h8v2m-8 0a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1z" />
          </svg>
          Atividade Recente
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
          {recentEvents.length > 0 ? (
            <div className="space-y-3">
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {getEventTypeText(event.type)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimeAgo(event.timestamp)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {event.data && typeof event.data === 'object' ? (
                        Object.entries(event.data).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {String(value).slice(0, 20)}{String(value).length > 20 ? '...' : ''}
                          </span>
                        ))
                      ) : (
                        String(event.data)
                      )}
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    event.impact === 'positive' ? 'bg-green-400' :
                    event.impact === 'warning' ? 'bg-yellow-400' :
                    event.impact === 'critical' ? 'bg-red-400' : 'bg-gray-400'
                  }`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">Nenhuma atividade recente</p>
            </div>
          )}
        </div>
      </div>

      {/* Interpretação Eudaimónica */}
      <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
        <div className="text-sm">
          <div className="font-semibold text-purple-800 mb-1">
            Princípio da Metacognição
          </div>
          <div className="text-purple-700">
            {consensusLevel === 'high' ? (
              "A comunidade demonstra forte consciência coletiva e tomada de decisão equilibrada."
            ) : consensusLevel === 'medium' ? (
              "O sistema de governança funciona adequadamente, mas há espaço para melhorar o engajamento."
            ) : (
              "A baixa participação pode comprometer a qualidade das decisões coletivas."
            )}
          </div>
        </div>
      </div>

      {/* Propostas Recentes (se houver) */}
      {recentProposals.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800">Propostas Recentes</h4>
          {recentProposals.slice(0, 3).map((proposal) => (
            <div key={Number(proposal.id)} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Proposta #{Number(proposal.id)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {proposal.description.slice(0, 100)}
                    {proposal.description.length > 100 ? '...' : ''}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Por: {proposal.proposer.slice(0, 8)}...</span>
                    <span>Sim: {Number(proposal.yesVotes)}</span>
                    <span>Não: {Number(proposal.noVotes)}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  proposal.executed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {proposal.executed ? 'Executada' : 'Ativa'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}