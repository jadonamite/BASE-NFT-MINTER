// app/components/Header.tsx
'use client';

import { useAccount, useSwitchChain } from 'wagmi';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { SUPPORTED_CHAINS, getChainConfig } from '../lib/constants';
import { useState } from 'react';

export default function Header() {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [isChainMenuOpen, setIsChainMenuOpen] = useState(false);

  const currentChain = chain ? getChainConfig(chain.id) : SUPPORTED_CHAINS.base;

  const handleChainSwitch = (chainId: number) => {
    switchChain?.({ chainId });
    setIsChainMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#A6FFE7] to-[#64D9C5] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-[#064E3B] font-bold text-xl">M</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">Mintly</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Transform moments into memories</p>
            </div>
          </div>

          {/* Right Side: Chain Selector + Wallet */}
          <div className="flex items-center gap-3">
            {/* Chain Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsChainMenuOpen(!isChainMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {currentChain.name}
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isChainMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isChainMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsChainMenuOpen(false)}
                  />
                  
                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                    {Object.values(SUPPORTED_CHAINS).map((chainConfig) => (
                      <button
                        key={chainConfig.id}
                        onClick={() => handleChainSwitch(chainConfig.id)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                          currentChain.id === chainConfig.id ? 'bg-[#A6FFE7]/10 font-medium' : ''
                        }`}
                      >
                        <span className={currentChain.id === chainConfig.id ? 'text-[#064E3B]' : 'text-gray-700'}>
                          {chainConfig.name}
                        </span>
                        {currentChain.id === chainConfig.id && (
                          <span className="w-2 h-2 rounded-full bg-[#A6FFE7]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Wallet Button */}
            <appkit-button />
          </div>
        </div>
      </div>
    </header>
  );
}