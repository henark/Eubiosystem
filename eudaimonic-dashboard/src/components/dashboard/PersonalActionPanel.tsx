'use client';

import { useState } from 'react';
import { ConnectionState, TransactionState } from '@/types/energyGrid';
import { energyGridService } from '@/services/blockchainService';

interface PersonalActionPanelProps {
  connectionState: ConnectionState;
  onUpdate: () => void;
}

export default function PersonalActionPanel({ connectionState, onUpdate }: PersonalActionPanelProps) {
  const [activeTab, setActiveTab] = useState<'energy' | 'governance' | 'transfers'>('energy');
  const [txState, setTxState] = useState<TransactionState>({ status: 'idle' });
  
  // Estados dos formulários
  const [energyAmount, setEnergyAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [voteProposalId, setVoteProposalId] = useState('');
  const [voteIntensity, setVoteIntensity] = useState(5);
  const [donationTo, setDonationTo] = useState('');
  const [donationAmount, setDonationAmount] = useState('');

  const handleTransaction = async (txFunction: () => Promise<string>, successMessage: string) => {
    try {
      setTxState({ status: 'loading' });
      const txHash = await txFunction();
      setTxState({ status: 'success', txHash });
      onUpdate();
      
      // Reset após 3 segundos
      setTimeout(() => {
        setTxState({ status: 'idle' });
      }, 3000);
      
    } catch (error) {
      console.error('Erro na transação:', error);
      setTxState({ status: 'error', error: error instanceof Error ? error.message : 'Erro desconhecido' });
      
      // Reset após 5 segundos
      setTimeout(() => {
        setTxState({ status: 'idle' });
      }, 5000);
    }
  };

  const handleRegisterMember = () => {
    handleTransaction(
      () => energyGridService.registerMember(),
      'Membro registrado com sucesso!'
    );
  };

  const handleReportEnergy = () => {
    if (!energyAmount || isNaN(Number(energyAmount))) {
      alert('Por favor, insira uma quantidade válida de energia.');
      return;
    }
    
    handleTransaction(
      () => energyGridService.reportEnergyProduction(BigInt(energyAmount)),
      'Produção de energia reportada com sucesso!'
    );
    setEnergyAmount('');
  };

  const handleTransferCredits = () => {
    if (!transferTo || !transferAmount || isNaN(Number(transferAmount))) {
      alert('Por favor, preencha todos os campos com valores válidos.');
      return;
    }
    
    handleTransaction(
      () => energyGridService.transferCredits(transferTo, BigInt(transferAmount)),
      'Créditos transferidos com sucesso!'
    );
    setTransferTo('');
    setTransferAmount('');
  };

  const handleCreateProposal = () => {
    if (!proposalDescription.trim()) {
      alert('Por favor, insira uma descrição para a proposta.');
      return;
    }
    
    handleTransaction(
      () => energyGridService.createProposal(proposalDescription),
      'Proposta criada com sucesso!'
    );
    setProposalDescription('');
  };

  const handleVoteQuadratic = (support: boolean) => {
    if (!voteProposalId || isNaN(Number(voteProposalId))) {
      alert('Por favor, insira um ID de proposta válido.');
      return;
    }
    
    handleTransaction(
      () => energyGridService.voteQuadratic(BigInt(voteProposalId), support, voteIntensity),
      `Voto ${support ? 'favorável' : 'contrário'} registrado com sucesso!`
    );
    setVoteProposalId('');
  };

  const handleAnonymousVote = async (support: boolean) => {
    if (!voteProposalId || isNaN(Number(voteProposalId))) {
      alert('Por favor, insira um ID de proposta válido.');
      return;
    }
    if (!connectionState.address) {
      alert('Não foi possível obter o seu endereço. Verifique se a carteira está conectada.');
      return;
    }

    setTxState({ status: 'loading' });

    try {
      const response = await fetch('http://localhost:3002/relay-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposalId: Number(voteProposalId),
          voter: connectionState.address,
          support: support,
          intensity: voteIntensity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao retransmitir o voto.');
      }

      setTxState({ status: 'success', txHash: data.transactionHash });

      // Reset after 3 seconds
      setTimeout(() => {
        setTxState({ status: 'idle' });
        onUpdate(); // Refresh data after the message disappears
      }, 3000);

    } catch (error) {
      console.error('Erro ao retransmitir o voto:', error);
      setTxState({ status: 'error', error: error instanceof Error ? error.message : 'Erro desconhecido' });

      // Reset after 5 seconds
      setTimeout(() => {
        setTxState({ status: 'idle' });
      }, 5000);
    }
  };

  const handleDonateCredits = () => {
    if (!donationTo || !donationAmount || isNaN(Number(donationAmount))) {
      alert('Por favor, preencha todos os campos com valores válidos.');
      return;
    }
    
    handleTransaction(
      () => energyGridService.donateVotingCredits(donationTo, BigInt(donationAmount)),
      'Créditos de votação doados com sucesso!'
    );
    setDonationTo('');
    setDonationAmount('');
  };

  const getVoteCost = (intensity: number): number => {
    return intensity * intensity;
  };

  const renderTransactionStatus = () => {
    if (txState.status === 'idle') return null;

    return (
      <div className={`mb-4 p-4 rounded-lg ${
        txState.status === 'loading' ? 'bg-blue-50 border border-blue-200' :
        txState.status === 'success' ? 'bg-green-50 border border-green-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center">
          {txState.status === 'loading' && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          )}
          {txState.status === 'success' && (
            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {txState.status === 'error' && (
            <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <div>
            <div className={`font-medium ${
              txState.status === 'loading' ? 'text-blue-800' :
              txState.status === 'success' ? 'text-green-800' :
              'text-red-800'
            }`}>
              {txState.status === 'loading' && 'Processando transação...'}
              {txState.status === 'success' && 'Transação concluída!'}
              {txState.status === 'error' && 'Erro na transação'}
            </div>
            {txState.status === 'success' && 'txHash' in txState && (
              <div className="text-sm text-green-600">
                Hash: {txState.txHash.slice(0, 20)}...
              </div>
            )}
            {txState.status === 'error' && 'error' in txState && (
              <div className="text-sm text-red-600">
                {txState.error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!connectionState.isRegisteredMember && connectionState.isConnected) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Junte-se ao Ecossistema
        </h3>
        <p className="text-gray-600 mb-6">
          Para participar plenamente da rede energética, você precisa se registrar como membro.
        </p>
        
        {renderTransactionStatus()}
        
        <button
          onClick={handleRegisterMember}
          disabled={txState.status === 'loading'}
          className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          {txState.status === 'loading' ? 'Registrando...' : 'Registrar como Membro'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status do Membro */}
      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-emerald-800">Membro Ativo</div>
            <div className="text-sm text-emerald-600">
              Saldo: {connectionState.memberInfo?.energyCredits ? Number(connectionState.memberInfo.energyCredits) : 0} créditos
            </div>
          </div>
          <div className="text-emerald-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {renderTransactionStatus()}

      {/* Tabs de Navegação */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('energy')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'energy' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Energia
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'governance' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Governança
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'transfers' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Transferências
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'energy' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Reportar Produção de Energia
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade (kWh)
              </label>
              <input
                type="number"
                value={energyAmount}
                onChange={(e) => setEnergyAmount(e.target.value)}
                placeholder="Ex: 1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <button
              onClick={handleReportEnergy}
              disabled={txState.status === 'loading' || !energyAmount}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Reportar Produção
            </button>
          </div>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="space-y-6">
          {/* Criar Proposta */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Criar Proposta
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição da Proposta
                </label>
                <textarea
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  placeholder="Descreva sua proposta..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <button
                onClick={handleCreateProposal}
                disabled={txState.status === 'loading' || !proposalDescription.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Criar Proposta
              </button>
            </div>
          </div>

          {/* Votação Quadrática */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Votação Quadrática
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID da Proposta
                </label>
                <input
                  type="number"
                  value={voteProposalId}
                  onChange={(e) => setVoteProposalId(e.target.value)}
                  placeholder="Ex: 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensidade do Voto: {voteIntensity} (Custo: {getVoteCost(voteIntensity)} créditos)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={voteIntensity}
                  onChange={(e) => setVoteIntensity(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Fraco (1)</span>
                  <span>Forte (10)</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleVoteQuadratic(true)}
                  disabled={txState.status === 'loading' || !voteProposalId}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Votar A Favor
                </button>
                <button
                  onClick={() => handleVoteQuadratic(false)}
                  disabled={txState.status === 'loading' || !voteProposalId}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Votar Contra
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Ou vote anonimamente através da rede de privacidade (simulado):
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnonymousVote(true)}
                    disabled={txState.status === 'loading' || !voteProposalId}
                    className="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    A Favor (Anônimo)
                  </button>
                  <button
                    onClick={() => handleAnonymousVote(false)}
                    disabled={txState.status === 'loading' || !voteProposalId}
                    className="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Contra (Anônimo)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transfers' && (
        <div className="space-y-6">
          {/* Transferir Créditos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transferir Créditos de Energia
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço do Destinatário
                </label>
                <input
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Ex: 100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              
              <button
                onClick={handleTransferCredits}
                disabled={txState.status === 'loading' || !transferTo || !transferAmount}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Transferir Créditos
              </button>
            </div>
          </div>

          {/* Doar Créditos de Votação */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Doar Créditos de Votação
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço do Destinatário
                </label>
                <input
                  type="text"
                  value={donationTo}
                  onChange={(e) => setDonationTo(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade de Créditos
                </label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Ex: 50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <button
                onClick={handleDonateCredits}
                disabled={txState.status === 'loading' || !donationTo || !donationAmount}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Doar Créditos de Votação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé com Princípio Eudaimónico */}
      <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
        <div className="text-sm">
          <div className="font-semibold text-amber-800 mb-1">
            Princípio da Ressonância Semântica
          </div>
          <div className="text-amber-700">
            Suas ações aqui criam ondas que se propagam por todo o ecossistema, 
            fortalecendo a rede através da participação consciente e responsável.
          </div>
        </div>
      </div>
    </div>
  );
}