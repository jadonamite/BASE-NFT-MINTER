// app/hooks/useMintFee.ts
import { useReadContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ABI, getContractAddress, SUPPORTED_CHAINS } from '../lib/constants';

export function useMintFee() {
  const { chain } = useAccount();
  
  // Use current chain or default to Base
  const chainId = chain?.id || SUPPORTED_CHAINS.base.id;
  const contractAddress = getContractAddress(chainId);

  const { data: mintFee, isLoading, isError } = useReadContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'MINT_FEE',
    chainId: chainId,
  });

  // Format the fee for display
  const mintFeeWei = mintFee as bigint | undefined;
  const mintFeeEth = mintFeeWei ? formatEther(mintFeeWei) : '0.0000175';

  return {
    mintFeeWei,
    mintFeeEth,
    isLoading,
    isError,
  };
}