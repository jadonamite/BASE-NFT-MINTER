// app/components/StatsCounter.tsx
'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { SUPPORTED_CHAINS, CONTRACT_ABI, getContractAddress } from '../lib/constants';
import { formatEther } from 'viem';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function StatsCounter() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { chain } = useAccount();

  // Fetch total minted from Base
  const { data: baseMinted } = useReadContract({
    address: getContractAddress(SUPPORTED_CHAINS.base.id),
    abi: CONTRACT_ABI,
    functionName: 'getTotalMinted',
    chainId: SUPPORTED_CHAINS.base.id,
  });

  // Fetch total minted from Celo
  const { data: celoMinted } = useReadContract({
    address: getContractAddress(SUPPORTED_CHAINS.celo.id),
    abi: CONTRACT_ABI,
    functionName: 'getTotalMinted',
    chainId: SUPPORTED_CHAINS.celo.id,
  });

  // Fetch mint fee from current chain
  const { data: mintFee } = useReadContract({
    address: getContractAddress(chain?.id || SUPPORTED_CHAINS.base.id),
    abi: CONTRACT_ABI,
    functionName: 'MINT_FEE',
    chainId: chain?.id || SUPPORTED_CHAINS.base.id,
  });

  // Calculate combined total
  const baseTotal = baseMinted ? Number(baseMinted) : 0;
  const celoTotal = celoMinted ? Number(celoMinted) : 0;
  const combinedTotal = baseTotal + celoTotal;

  // Format mint fee
  const feeFormatted = mintFee ? formatEther(mintFee as bigint) : '0.0000175';
  const currentChainName = chain?.name || 'Base';
  const currentChainCurrency = chain?.id === SUPPORTED_CHAINS.celo.id ? 'CELO' : 'ETH';

  return (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className={`w-full transition-all duration-300 ${
        isExpanded ? 'card-dark p-8' : 'bg-white border-2 border-gray-200 hover:border-[#A6FFE7] p-4 rounded-xl'
      }`}
    >
      {!isExpanded ? (
        // Collapsed View
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 text-[#A6FFE7]" />
            <div className="text-left">
              <p className="text-sm text-gray-500">Total Minted</p>
              <p className="text-2xl font-bold text-gray-900">
                {combinedTotal.toLocaleString()}
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">Click to expand →</span>
        </div>
      ) : (
        // Expanded View
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#A6FFE7]/20 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-7 h-7 text-[#A6FFE7]" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Mintly Stats</h3>
                <p className="text-sm text-gray-400">Live on-chain data</p>
              </div>
            </div>
            <span className="text-xs text-gray-500"><XMarkIcon className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" /></span>
          </div>

          {/* Combined Total */}
          <div className="bg-[#A6FFE7]/10 rounded-lg p-6 border border-[#A6FFE7]/30">
            <p className="text-sm text-gray-400 mb-2">Total NFTs Minted</p>
            <p className="text-5xl font-bold text-[#A6FFE7]">
              {combinedTotal.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Join {combinedTotal.toLocaleString()} creators on Base & Celo
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-700" />

          {/* Per-Chain Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Base Stats */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Base Network</p>
              <p className="text-3xl font-bold text-white">
                {baseTotal.toLocaleString()}
              </p>
            </div>

            {/* Celo Stats */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Celo Network</p>
              <p className="text-3xl font-bold text-white">
                {celoTotal.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Mint Fee Info */}
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Current Mint Fee ({currentChainName})</p>
            <p className="text-2xl font-bold text-[#A6FFE7]">
              {feeFormatted} {currentChainCurrency}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Plus network gas fees
            </p>
          </div>
        </div>
      )}
    </button>
  );
}