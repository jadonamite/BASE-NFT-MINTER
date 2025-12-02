import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { config } from '@/app/config/index'; 
import { readContract } from '@wagmi/core';
import BaseMinterABI from '@/app/abis/BaseMInter.json';

export interface NFTItem {
  id: number;
  uri: string;
  metadata: {
    name?: string;
    description?: string;
    image?: string;
  } | null;
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function useNFTData() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Read the list of Token IDs owned by the user
  const { data: tokenIds, refetch: refetchIDs } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BaseMinterABI,
    functionName: 'getUserTokens',
    args: [address],
    query: {
      enabled: !!address && isConnected, 
    }
  });

  // 2. Effect: Fetch metadata when IDs are found
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenIds || !Array.isArray(tokenIds) || tokenIds.length === 0) {
        setNfts([]);
        return;
      }

      setLoading(true);
      try {
        const promises = tokenIds.map(async (idBigInt) => {
          const id = Number(idBigInt);

          // A. Get Token URI from contract
          const uri = await readContract(config, {
            address: CONTRACT_ADDRESS,
            abi: BaseMinterABI,
            functionName: 'tokenURI',
            args: [BigInt(id)],
          }) as string;

          // B. Convert IPFS URI to NFT.Storage Gateway URL
          // If uri starts with "ipfs://", replace it.
          const gatewayUrl = uri.replace('ipfs://', 'https://nftstorage.link/ipfs/');

          // C. Fetch the JSON
          let metadata = null;
          try {
            const response = await fetch(gatewayUrl);
            const json = await response.json();
            
            // D. Fix the image URL inside the metadata
            // Usually looks like "ipfs://bafy..."
            if (json.image && json.image.startsWith('ipfs://')) {
              json.image = json.image.replace('ipfs://', 'https://nftstorage.link/ipfs/');
            }
            metadata = json;
          } catch (err) {
            console.error(`Failed to fetch metadata for token ${id}`, err);
          }

          return { id, uri, metadata };
        });

        const results = await Promise.all(promises);
        setNfts(results.sort((a, b) => b.id - a.id)); // Newest first
      } catch (error) {
        console.error("Error fetching NFT data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tokenIds) {
      fetchMetadata();
    }
  }, [tokenIds]);

  return { nfts, loading, refetch: refetchIDs };
}