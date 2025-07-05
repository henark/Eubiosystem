'use client';

import { useState } from 'react';
import { ConnectionState } from '@/types/energyGrid';

interface ConnectWalletProps {
  connectionState: ConnectionState;
  onConnect: (address: string) => void;
}

export default function ConnectWallet({ connectionState, onConnect }: ConnectWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask não foi detectado. Por favor, instale o MetaMask para continuar.');
      return;
    }

    try {
      setIsConnecting(true);
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        onConnect(accounts[0]);
      }
    } catch (error) {
      console.error('Erro ao conectar wallet:', error);
      alert('Erro ao conectar com MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  const getNetworkStatusColor = () => {
    switch (connectionState.networkHealth) {
      case 'connected': return 'bg-green-500';
      case 'syncing': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!connectionState.isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Conectando...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Conectar Wallet</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Indicador de Status da Rede */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getNetworkStatusColor()}`}></div>
        <span className="text-sm text-emerald-700 capitalize">
          {connectionState.networkHealth}
        </span>
      </div>

      {/* Informações da Carteira */}
      <div className="bg-white/80 rounded-lg px-4 py-2 border border-emerald-200">
        <div className="text-sm">
          <div className="font-medium text-emerald-900">
            {connectionState.address?.slice(0, 6)}...{connectionState.address?.slice(-4)}
          </div>
          <div className="text-emerald-600 text-xs">
            {connectionState.isRegisteredMember ? 'Membro Ativo' : 'Não Registrado'}
          </div>
        </div>
      </div>
    </div>
  );
}