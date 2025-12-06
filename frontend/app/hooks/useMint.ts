// app/hooks/useMint.ts
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEventLogs } from 'viem';
import { uploadNFTMetadata } from '../utils/ipfs';
import { CONTRACT_ABI, getContractAddress } from '../lib/constants';

interface MintResult {
  success: boolean;
  tokenId?: number;
  txHash?: string;
  error?: string;
}

export function useMint() {
  const { address, chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<number | undefined>();

  // Get contract address for current chain
  const contractAddress = getContractAddress(chain?.id || 8453);

  // Read mint fee from contract
  const { data: mintFeeData } = useReadContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'MINT_FEE',
    chainId: chain?.id || 8453,
  });

  // Wait for transaction receipt
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: chain?.id || 8453,
  });

  const reset = () => {
    setIsUploading(false);
    setIsMinting(false);
    setIsSuccess(false);
    setError(null);
    setTokenId(undefined);
    setTxHash(undefined);
  };

  const mintNFT = async (
    file: File,
    name: string,
    description: string
  ): Promise<MintResult> => {
    reset();

    // Check wallet connection
    if (!address || !chain) {
      const errorMsg = 'Please connect your wallet';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Get contract address for current chain
    const contractAddress = getContractAddress(chain.id);

    try {
      // Step 1: Upload to IPFS
      setIsUploading(true);
      const tokenURI = await uploadNFTMetadata(file, name, description, address);
      setIsUploading(false);

      // Step 2: Get mint fee
      setIsMinting(true);
      const mintFee = (mintFeeData as bigint) || BigInt('17500000000000');

      // Step 3: Call mintNFT function
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: CONTRACT_ABI,
        functionName: 'mintNFT',
        args: [tokenURI],
        value: mintFee,
        chainId: chain.id,
      });

      setTxHash(hash);

      // Step 4: Wait for confirmation (handled by useWaitForTransactionReceipt hook)
      // The receipt will be available once confirmed

      // Step 5: Parse event to get token ID (will happen after receipt is available)
      // For now, return success with hash
      setIsSuccess(true);
      setIsMinting(false);

      return {
        success: true,
        tokenId: undefined, // Will be parsed from receipt
        txHash: hash,
      };

    } catch (err: any) {
      setIsMinting(false);
      
      // Parse error message
      let errorMessage = 'Minting failed';
      
      if (err.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (err.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for mint fee + gas';
      } else if (err.message?.includes('IPFS')) {
        errorMessage = 'Failed to upload to IPFS. Please try again.';
      } else if (err.shortMessage) {
        errorMessage = err.shortMessage;
      }

      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    mintNFT,
    reset,
    isUploading,
    isMinting: isMinting || isConfirming,
    isSuccess,
    error,
    tokenId,
    txHash,
    receipt,
  };
}