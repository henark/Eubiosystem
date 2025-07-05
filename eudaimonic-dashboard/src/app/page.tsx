'use client';

import { useState, useEffect } from 'react';
import { SystemHealth, ConnectionState, EnergyGridEvent } from '@/types/energyGrid';
import { energyGridService } from '@/services/blockchainService';

// Importar componentes (serão criados a seguir)
import ResilienceGauge from '@/components/dashboard/ResilienceGauge';
import EquityIndex from '@/components/dashboard/EquityIndex';
import GovernanceActivity from '@/components/dashboard/GovernanceActivity';
import PersonalActionPanel from '@/components/dashboard/PersonalActionPanel';
import SystemPulse from '@/components/dashboard/SystemPulse';
import ConnectWallet from '@/components/ui/ConnectWallet';

/**
 * DASHBOARD DA SAÚDE SISTÉMICA
 * 
 * Este é o "espelho da alma" do nosso ecossistema Eudaimónico.
 * Não apenas mostra dados, mas reflete a interconnexão e saúde
 * dos princípios fundamentais da Engenharia Eudaimónica.
 * 
 * Filosofia de Design:
 * - Cada seção representa um princípio Eudaimónico
 * - A interface respira com o ritmo da rede
 * - Feedback imediato e estados claros (Autopoiese)
 * - Visualização da harmonia sistémica (Simbiose)
 */
export default function EudaimonicDashboard() {
  // Estados para consciência sistémica
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: false,
    isRegisteredMember: false,
    networkHealth: 'disconnected'
  });
  const [recentEvents, setRecentEvents] = useState<EnergyGridEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Efeito de inicialização e monitorização
  useEffect(() => {
    initializeDashboard();
    
    // Subscreve eventos em tempo real
    const unsubscribe = energyGridService.subscribeToEvents((event) => {
      setRecentEvents(prev => [event, ...prev.slice(0, 9)]); // Mantém últimos 10 eventos
      setLastUpdate(new Date());
    });

    // Atualização periódica da saúde sistémica
    const intervalId = setInterval(updateSystemHealth, 30000); // A cada 30 segundos

    return () => {
      clearInterval(intervalId);
    };
  }, [connectionState.isConnected]);

  const initializeDashboard = async () => {
    try {
      setIsLoading(true);
      
      // Verificar conexão com wallet
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          const address = accounts[0];
          
          // Verificar se é membro registrado
          const memberInfo = await energyGridService.getMemberInfo(address);
          
          setConnectionState({
            isConnected: true,
            address,
            isRegisteredMember: !!memberInfo,
            memberInfo: memberInfo || undefined,
            networkHealth: 'connected'
          });
        }
      }
      
      await updateSystemHealth();
    } catch (error) {
      console.error('Erro na inicialização:', error);
      setConnectionState(prev => ({ ...prev, networkHealth: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };

  const updateSystemHealth = async () => {
    try {
      const health = await energyGridService.calculateSystemHealth();
      setSystemHealth(health);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao atualizar saúde sistémica:', error);
    }
  };

  const handleWalletConnect = async (address: string) => {
    try {
      const memberInfo = await energyGridService.getMemberInfo(address);
      
      setConnectionState({
        isConnected: true,
        address,
        isRegisteredMember: !!memberInfo,
        memberInfo: memberInfo || undefined,
        networkHealth: 'connected'
      });
    } catch (error) {
      console.error('Erro ao conectar wallet:', error);
    }
  };

  // Estado de carregamento inicial
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-lg text-emerald-800">Sincronizando com o Ecossistema...</p>
          <p className="text-sm text-emerald-600">Estabelecendo ressonância com a rede</p>
        </div>
      </div>
    );
  }

  // Interface principal do Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50">
      {/* Header Eudaimónico */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-emerald-900">
                Dashboard Sistémico
              </h1>
              <p className="text-emerald-700 mt-1">
                Espelho da Saúde do Ecossistema Energético
              </p>
            </div>
            
            {/* Pulso Sistémico - Indicador de Vida */}
            <div className="flex items-center space-x-4">
              <SystemPulse 
                health={systemHealth}
                lastUpdate={lastUpdate}
                networkHealth={connectionState.networkHealth}
              />
              
              <ConnectWallet 
                connectionState={connectionState}
                onConnect={handleWalletConnect}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Corpo Principal do Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mensagem para não-membros */}
        {connectionState.isConnected && !connectionState.isRegisteredMember && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Bem-vindo ao Ecossistema Eudaimónico
                </h3>
                <p className="mt-1 text-sm text-amber-700">
                  Você ainda não é um membro registrado. Registre-se para participar plenamente do ecossistema energético.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid Principal dos Princípios Eudaimónicos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* AUTOPOIESE: Medidor de Resiliência */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Medidor de Resiliência
              </h2>
              <p className="text-emerald-100 text-sm">Autopoiese - Capacidade de auto-regeneração</p>
            </div>
            <div className="p-6">
              <ResilienceGauge health={systemHealth?.resilience} />
            </div>
          </div>

          {/* SIMBIOSE: Índice de Equidade */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Índice de Equidade
              </h2>
              <p className="text-cyan-100 text-sm">Simbiose - Distribuição harmoniosa de recursos</p>
            </div>
            <div className="p-6">
              <EquityIndex health={systemHealth?.equity} />
            </div>
          </div>
        </div>

        {/* METACOGNIÇÃO: Feed de Atividade da Governança */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Feed de Atividade da Governança
            </h2>
            <p className="text-purple-100 text-sm">Metacognição - Consciência coletiva em ação</p>
          </div>
          <div className="p-6">
            <GovernanceActivity 
              governance={systemHealth?.governance}
              recentEvents={recentEvents}
            />
          </div>
        </div>

        {/* RESSONÂNCIA SEMÂNTICA: Painel de Ação Pessoal */}
        {connectionState.isConnected && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Painel de Ação Pessoal
              </h2>
              <p className="text-amber-100 text-sm">Ressonância Semântica - Sua interface com o ecossistema</p>
            </div>
            <div className="p-6">
              <PersonalActionPanel 
                connectionState={connectionState}
                onUpdate={updateSystemHealth}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer com Informações Sistémicas */}
      <footer className="bg-emerald-900 text-emerald-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">
              Ecossistema Energético Eudaimónico
            </p>
            <p className="text-emerald-300 text-sm">
              Onde a tecnologia encontra a sabedoria, e a energia flui em harmonia
            </p>
            <div className="mt-4 text-xs text-emerald-400">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
