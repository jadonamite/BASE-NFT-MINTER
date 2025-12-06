// app/hooks/useMint.ts
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
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
  
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<number | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();

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

      // Step 2: Read mint fee from contract
      setIsMinting(true);
      const mintFeeData = await fetch('/api/mint-fee').then(res => res.json()).catch(() => null);
      const mintFee = mintFeeData?.fee || BigInt('17500000000000'); // Fallback to 0.0000175 ETH

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

      // Step 4: Wait for transaction confirmation
      const receipt = await new Promise<any>((resolve, reject) => {
        const checkReceipt = async () => {
          try {
            const response = await fetch(`/api/tx-receipt?hash=${hash}&chainId=${chain.id}`);
            if (response.ok) {
              const data = await response.json();
              if (data.receipt) {
                resolve(data.receipt);
                return;
              }
            }
            // Retry after 2 seconds
            setTimeout(checkReceipt, 2000);
          } catch (err) {
            reject(err);
          }
        };
        checkReceipt();
      });

      // Step 5: Parse NFTMinted event to get token ID
      let mintedTokenId: number | undefined;
      
      try {
        const logs = parseEventLogs({
          abi: CONTRACT_ABI,
          logs: receipt.logs,
          eventName: 'NFTMinted',
        });

        if (logs.length > 0) {
          mintedTokenId = Number(logs[0].args.tokenId);
        }
      } catch (parseError) {
        console.warn('Failed to parse event logs:', parseError);
        // Fallback: Try to get total minted and assume it's the last one
        try {
          const totalMinted = await fetch(`/api/total-minted?chainId=${chain.id}`).then(res => res.json());
          mintedTokenId = totalMinted.total;
        } catch {
          // If all else fails, we still have the tx hash
        }
      }

      // Success!
      setTokenId(mintedTokenId);
      setIsSuccess(true);
      setIsMinting(false);

      return {
        success: true,
        tokenId: mintedTokenId,
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
    isMinting,
    isSuccess,
    error,
    tokenId,
    txHash,
  };
}