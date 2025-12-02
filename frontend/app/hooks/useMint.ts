'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, usePublicClient } from 'wagmi';
import { parseEventLogs } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/constants';
import { uploadNFTMetadata } from '../utils/ipfs';
import { useMintFee } from './useMintFee';
import type { MintState } from '../types/nft';

/**
 * Main minting hook - handles entire mint flow
 * 1. Upload to IPFS
 * 2. Send blockchain transaction
 * 3. Wait for confirmation
 * 4. Extract token ID from event
 */
export function useMint() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { mintFeeWei } = useMintFee();
  
  const [mintState, setMintState] = useState<MintState>({
    isUploading: false,
    isMinting: false,
    isSuccess: false,
    error: null,
  });

  // Wagmi hooks for contract interaction
  const { writeContractAsync } = useWriteContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: mintState.txHash as `0x${string}` | undefined,
  });

  /**
   * Main mint function
   */
  const mintNFT = async (file: File, name: string, description: string) => {
    try {
      // Reset state
      setMintState({
        isUploading: true,
        isMinting: false,
        isSuccess: false,
        error: null,
      });

      // Step 1: Upload to IPFS
      console.log('🚀 Starting IPFS upload...');
      const tokenURI = await uploadNFTMetadata(file, name, description, address);
      console.log('✅ IPFS upload complete:', tokenURI);

      // Step 2: Prepare for minting
      setMintState(prev => ({
        ...prev,
        isUploading: false,
        isMinting: true,
      }));

      if (!mintFeeWei) {
        throw new Error('Mint fee not loaded');
      }

      console.log('🔨 Sending mint transaction...');
      
      // Step 3: Send transaction
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintNFT',
        args: [tokenURI],
        value: mintFeeWei,
      });

      console.log('📝 Transaction sent:', hash);
      
      setMintState(prev => ({
        ...prev,
        txHash: hash,
      }));

      // Step 4: Wait for confirmation
      console.log('⏳ Waiting for confirmation...');
      const txReceipt = await publicClient?.waitForTransactionReceipt({ hash });

      if (!txReceipt) {
        throw new Error('Transaction receipt not found');
      }

      // Step 5: Extract token ID from event (PRIMARY METHOD)
      let tokenId: number | undefined;

      try {
        const logs = parseEventLogs({
          abi: CONTRACT_ABI,
          logs: txReceipt.logs,
          eventName: 'NFTMinted',
        });

        if (logs && logs.length > 0) {
          tokenId = Number(logs[0].args.tokenId);
          console.log('✅ Token ID from event:', tokenId);
        }
      } catch (eventError) {
        console.warn('⚠️ Could not parse event, will rely on success state:', eventError);
      }

      // Step 6: Success!
      setMintState({
        isUploading: false,
        isMinting: false,
        isSuccess: true,
        error: null,
        tokenId,
        txHash: hash,
      });

      console.log('🎉 Mint successful!');
      return { success: true, tokenId, txHash: hash };

    } catch (error: any) {
      console.error('❌ Mint error:', error);
      
      let errorMessage = 'Minting failed. Please try again.';
      
      // Handle specific errors
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for mint fee + gas.';
      } else if (error.message?.includes('IPFS')) {
        errorMessage = 'Failed to upload to IPFS. Please try again.';
      }

      setMintState({
        isUploading: false,
        isMinting: false,
        isSuccess: false,
        error: errorMessage,
      });

      throw error;
    }
  };

  /**
   * Reset mint state (for minting again)
   */
  const reset = () => {
    setMintState({
      isUploading: false,
      isMinting: false,
      isSuccess: false,
      error: null,
    });
  };

  return {
    mintNFT,
    reset,
    ...mintState,
    isConfirming, // Separate state for transaction confirmation
  };
}