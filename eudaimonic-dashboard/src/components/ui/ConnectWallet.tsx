'use client';

import { useConnect, useEthereum } from '@particle-network/authkit';

export default function ConnectWallet() {
  const { connect, disconnect, connected } = useConnect();
  const { address } = useEthereum();

  const handleConnect = async () => {
    if (!connected) {
      await connect();
    }
  };

  const handleDisconnect = async () => {
    if (connected) {
      await disconnect();
    }
  };

  const getNetworkStatusColor = () => {
    return connected ? 'bg-green-500' : 'bg-gray-500';
  };

  if (!connected) {
    return (
      <button
        onClick={handleConnect}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Conectar Wallet</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getNetworkStatusColor()}`}></div>
        <span className="text-sm text-emerald-700 capitalize">
          Connected
        </span>
      </div>
      <div className="bg-white/80 rounded-lg px-4 py-2 border border-emerald-200">
        <div className="text-sm">
          <div className="font-medium text-emerald-900">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          <button onClick={handleDisconnect} className="text-red-500 text-xs hover:underline">
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}