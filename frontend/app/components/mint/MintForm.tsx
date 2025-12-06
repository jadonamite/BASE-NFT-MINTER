// app/components/mint/MintForm.tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { CloudArrowUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useMint } from '@/app/hooks/useMint';
import { useMintFee } from '@/app/hooks/useMintFee';
import { SUPPORTED_CHAINS, APP_CONFIG, getChainConfig } from '@/app/lib/constants';
import ImagePreview from './ImagePreview';

export default function MintForm() {
  const { address, chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isChainMenuOpen, setIsChainMenuOpen] = useState(false);

  // Hooks
  const { mintFeeEth, isLoading: feeLoading } = useMintFee();
  const { mintNFT, isUploading, isMinting, isSuccess, error, reset } = useMint();

  const currentChain = chain ? getChainConfig(chain.id) : SUPPORTED_CHAINS.base;
  const isProcessing = isUploading || isMinting;

  // Validate file
  const validateFile = (file: File): boolean => {
    if (!APP_CONFIG.allowedFileTypes.includes(file.type as any)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
      return false;
    }
    if (file.size > APP_CONFIG.maxFileSize) {
      toast.error(`File too large. Maximum size is ${APP_CONFIG.maxFileSize / (1024 * 1024)}MB.`);
      return false;
    }
    return true;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      toast.success('Image selected!');
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  // File input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Chain switch
  const handleChainSwitch = (chainId: number) => {
    switchChain?.({ chainId });
    setIsChainMenuOpen(false);
  };

  // Submit mint
  const handleMint = async () => {
    // Validation
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }
    if (!name.trim()) {
      toast.error('Please enter an NFT name');
      return;
    }
    if (description.length > 500) {
      toast.error('Description is too long (max 500 characters)');
      return;
    }

    // Show uploading toast
    const uploadToast = toast.loading('Uploading to IPFS...');

    try {
      const result = await mintNFT(selectedFile, name.trim(), description.trim());
      
      toast.dismiss(uploadToast);
      
      if (result.success && result.tokenId && result.txHash) {
        toast.success(`NFT #${result.tokenId} minted successfully!`);
        
        // Reset form
        setSelectedFile(null);
        setName('');
        setDescription('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(result.error || 'Minting failed');
      }
    } catch (err) {
      toast.dismiss(uploadToast);
      toast.error('An unexpected error occurred');
      console.error('Mint error:', err);
    }
  };

  return (
    <div className="card-dark p-6 sm:p-8 space-y-6">
      {/* Chain Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Network
        </label>
        <div className="relative">
          <button
            onClick={() => setIsChainMenuOpen(!isChainMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="font-medium">{currentChain.name}</span>
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isChainMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isChainMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsChainMenuOpen(false)} />
              <div className="absolute left-0 right-0 mt-2 bg-[#0F172A] rounded-lg shadow-xl border border-white/10 py-2 z-50 animate-fade-in">
                {Object.values(SUPPORTED_CHAINS).map((chainConfig) => (
                  <button
                    key={chainConfig.id}
                    onClick={() => handleChainSwitch(chainConfig.id)}
                    className={`w-full px-4 py-2 text-left hover:bg-white/5 transition-colors flex items-center justify-between ${
                      currentChain.id === chainConfig.id ? 'bg-[#A6FFE7]/10' : ''
                    }`}
                  >
                    <span>{chainConfig.name}</span>
                    {currentChain.id === chainConfig.id && (
                      <span className="w-2 h-2 rounded-full bg-[#A6FFE7]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* File Upload Area */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#A6FFE7] bg-[#A6FFE7]/10'
              : 'border-white/20 hover:border-[#A6FFE7] hover:bg-white/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={APP_CONFIG.allowedFileTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <CloudArrowUpIcon className="w-16 h-16 mx-auto mb-4 text-[#A6FFE7]" />
          
          <p className="text-lg font-medium mb-2">
            {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
          </p>
          <p className="text-sm text-gray-400 mb-4">or click to browse</p>
          
          <div className="text-xs text-gray-500">
            <p>Supported: JPG, PNG, GIF, WebP</p>
            <p>Max size: 10MB</p>
          </div>
        </div>
      ) : (
        <ImagePreview file={selectedFile} onRemove={handleRemoveFile} />
      )}

      {/* NFT Name */}
      <div>
        <label htmlFor="nft-name" className="block text-sm font-medium text-gray-300 mb-2">
          NFT Name *
        </label>
        <input
          id="nft-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome NFT"
          maxLength={100}
          disabled={isProcessing}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#A6FFE7] focus:ring-2 focus:ring-[#A6FFE7]/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          {name.length}/100 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="nft-description" className="block text-sm font-medium text-gray-300 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="nft-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell the story behind your creation..."
          maxLength={500}
          rows={4}
          disabled={isProcessing}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#A6FFE7] focus:ring-2 focus:ring-[#A6FFE7]/20 outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          {description.length}/500 characters
        </p>
      </div>

      {/* Mint Fee Display */}
      <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
        <span className="text-sm text-gray-400">Mint Fee:</span>
        <span className="text-lg font-bold text-[#A6FFE7]">
          {feeLoading ? '...' : `${mintFeeEth} ${currentChain.currency}`}
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={!isConnected || !selectedFile || !name.trim() || isProcessing}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {isUploading && (
          <>
            <div className="loading-spinner border-[#064E3B]" />
            <span>Uploading to IPFS...</span>
          </>
        )}
        {isMinting && (
          <>
            <div className="loading-spinner border-[#064E3B]" />
            <span>Minting NFT...</span>
          </>
        )}
        {!isProcessing && (
          <span>Mint NFT</span>
        )}
      </button>

      {/* Connect Wallet Prompt */}
      {!isConnected && (
        <p className="text-center text-sm text-gray-400">
          Please connect your wallet to start minting
        </p>
      )}
    </div>
  );
}