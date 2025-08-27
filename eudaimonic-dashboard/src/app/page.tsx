'use client';

import { useState, useEffect } from 'react';
import { SystemHealth, EnergyGridEvent, Member } from '@/types/energyGrid';
import { energyGridService } from '@/services/blockchainService';
import { useConnect, useEthereum } from '@particle-network/authkit';
import { UniversalAccount } from '@particle-network/universal-account-sdk';

// Importar componentes
import ResilienceGauge from '@/components/dashboard/ResilienceGauge';
import EquityIndex from '@/components/dashboard/EquityIndex';
import GovernanceActivity from '@/components/dashboard/GovernanceActivity';
import PersonalActionPanel from '@/components/dashboard/PersonalActionPanel';
import SystemPulse from '@/components/dashboard/SystemPulse';
import ConnectWallet from '@/components/ui/ConnectWallet';

export default function EudaimonicDashboard() {
  // Particle Network Hooks
  const { connected } = useConnect();
  const { address, provider } = useEthereum();

  // Estados da aplicação
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [universalAccount, setUniversalAccount] = useState<UniversalAccount | null>(null);
  const [isRegisteredMember, setIsRegisteredMember] = useState<boolean>(false);
  const [recentEvents, setRecentEvents] = useState<EnergyGridEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Efeito para inicializar o Universal Account e carregar dados
  useEffect(() => {
    const initialize = async () => {
      if (connected && address) {
        setIsLoading(true);

        // Inicializa o Universal Account
        const ua = new UniversalAccount({
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
          projectClientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
          projectAppUuid: process.env.NEXT_PUBLIC_APP_ID!,
          ownerAddress: address,
          tradeConfig: {
            universalGas: true,
          },
        });
        setUniversalAccount(ua);
        energyGridService.setUniversalAccount(ua, provider); // Passa o UA para o service

        // Verifica se é membro
        const memberInfo = await energyGridService.getMemberInfo(address);
        setIsRegisteredMember(!!memberInfo);

        // Carrega a saúde do sistema
        await updateSystemHealth();

        setIsLoading(false);
      } else {
        // Reseta o estado quando desconectado
        setUniversalAccount(null);
        setIsRegisteredMember(false);
        setSystemHealth(null);
        setIsLoading(false);
      }
    };

    initialize();
  }, [connected, address, provider]);

  // Efeito para subscrever a eventos
  useEffect(() => {
    // Subscreve a eventos da blockchain
    const unsubscribe = energyGridService.subscribeToEvents((event) => {
      setRecentEvents(prev => [event, ...prev.slice(0, 9)]);
      setLastUpdate(new Date());
    });

    // Atualização periódica
    const intervalId = setInterval(updateSystemHealth, 30000);

    return () => {
      clearInterval(intervalId);
      // Aqui deveria ter uma função para `unsubscribe`, que não foi implementada no service ainda
    };
  }, []);

  const updateSystemHealth = async () => {
    try {
      const health = await energyGridService.calculateSystemHealth();
      setSystemHealth(health);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao atualizar saúde sistémica:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-lg text-emerald-800">Sincronizando com o Ecossistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-emerald-900">Dashboard Sistémico</h1>
              <p className="text-emerald-700 mt-1">Espelho da Saúde do Ecossistema Energético</p>
            </div>
            <div className="flex items-center space-x-4">
              <SystemPulse health={systemHealth} lastUpdate={lastUpdate} networkHealth={connected ? 'connected' : 'disconnected'} />
              <ConnectWallet />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {connected && !isRegisteredMember && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-amber-800">Bem-vindo ao Ecossistema Eudaimónico</h3>
            <p className="mt-1 text-sm text-amber-700">Você ainda não é um membro. Registre-se para participar.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200 overflow-hidden">
            <div className="p-6">
              <ResilienceGauge health={systemHealth?.resilience} />
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200 overflow-hidden">
            <div className="p-6">
              <EquityIndex health={systemHealth?.equity} />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200 overflow-hidden mb-8">
          <div className="p-6">
            <GovernanceActivity governance={systemHealth?.governance} recentEvents={recentEvents} />
          </div>
        </div>

        {connected && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200 overflow-hidden">
            <div className="p-6">
              <PersonalActionPanel 
                connectionState={{ isConnected: connected, address: address, isRegisteredMember: isRegisteredMember }}
                onUpdate={updateSystemHealth}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-emerald-900 text-emerald-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold mb-2">Ecossistema Energético Eudaimónico</p>
          <div className="mt-4 text-xs text-emerald-400">
            Última atualização: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </footer>
    </div>
  );
}
