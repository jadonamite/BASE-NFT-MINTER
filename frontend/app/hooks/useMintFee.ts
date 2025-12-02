'use client';

import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/constants';
import { formatEther } from 'viem';

/**
 * Hook to fetch the current mint fee from the contract
 * @returns Mint fee in ETH and wei, plus loading/error states
 */
export function useMintFee() {
  const { data: mintFeeWei, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'MINT_FEE',
  });

  // Convert wei to ETH for display
  const mintFeeEth = mintFeeWei ? formatEther(mintFeeWei) : '0';

  return {
    mintFeeWei, // Raw value in wei (for transactions)
    mintFeeEth, // Formatted value in ETH (for display)
    isLoading,
    isError,
    refetch,
  };
}