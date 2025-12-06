// app/components/mint/SuccessModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { getExplorerUrl, getTokenUrl } from '@/app/lib/constants';
import toast from 'react-hot-toast';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: number;
  txHash: string;
  chainId: number;
}

export default function SuccessModal({ isOpen, onClose, tokenId, txHash, chainId }: SuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const explorerUrl = getExplorerUrl(chainId, txHash);
  const tokenUrl = getTokenUrl(chainId, tokenId);
  const shortHash = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md bg-gradient-to-br from-[#A6FFE7] via-[#8FFFD9] to-[#64D9C5] rounded-2xl shadow-2xl animate-fade-in">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <CheckCircleIcon className="w-12 h-12 text-[#064E3B]" />
              </div>
              
              {/* Confetti Effect */}
              {showConfetti && (
                <div className="absolute inset-0 animate-pulse">
                  <span className="absolute top-0 left-0 text-2xl animate-bounce">🎉</span>
                  <span className="absolute top-0 right-0 text-2xl animate-bounce delay-100">🎊</span>
                  <span className="absolute bottom-0 left-0 text-2xl animate-bounce delay-200">✨</span>
                  <span className="absolute bottom-0 right-0 text-2xl animate-bounce delay-300">🎈</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-[#064E3B] mb-2">
              Success!
            </h2>
            <p className="text-lg text-[#064E3B]/80 mb-6">
              Your NFT has been minted
            </p>

            {/* Token Info */}
            <div className="bg-white/90 backdrop-blur rounded-xl p-6 mb-6 space-y-4">
              {/* Token ID */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Token ID</p>
                <p className="text-2xl font-bold text-[#064E3B]">
                  #{tokenId}
                </p>
              </div>

              {/* Transaction Hash */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Transaction Hash</p>
                <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3">
                  <span className="text-sm font-mono text-gray-700">
                    {shortHash}
                  </span>
                  <button
                    onClick={() => copyToClipboard(txHash, 'Transaction hash')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* View on Explorer */}
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#064E3B] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#065945] transition-all duration-200 hover:shadow-lg"
              >
                View on Block Explorer
              </a>

              {/* View NFT Details */}S
              <a
                href={tokenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-[#064E3B] font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                View NFT Details
              </a>

              {/* Mint Another */}
              <button
                onClick={onClose}
                className="w-full text-[#064E3B] font-medium py-3 hover:underline transition-all duration-200"
              >
                Mint Another NFT →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}