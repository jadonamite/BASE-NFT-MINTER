import { base } from 'wagmi/chains';

// Contract Configuration
export const CONTRACT_ADDRESS = '0x175357b6820C6d73CFBa870C662A24A9fB12eD6d' as const;

// Network Configuration
export const SUPPORTED_CHAINS = [base];
export const DEFAULT_CHAIN = base;

// Contract ABI - Complete from your deployment
export const CONTRACT_ABI = [
  {
    inputs: [{ internalType: 'string', name: 'tokenURI', type: 'string' }],
    name: 'mintNFT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINT_FEE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'count', type: 'uint256' }],
    name: 'getRecentMints',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserTokens',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getTokenMinter',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalMinted',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getMintCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'tokenURI', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'NFTMinted',
    type: 'event',
  },
] as const;

// IPFS Gateway Configuration
export const IPFS_GATEWAY = 'https://nftstorage.link/ipfs/';

// Helper function to convert ipfs:// URLs to https://
export function getIPFSUrl(ipfsUrl: string): string {
  if (!ipfsUrl) return '';
  
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace('ipfs://', IPFS_GATEWAY);
  }
  
  // If it's already an HTTP URL, return as-is
  if (ipfsUrl.startsWith('http://') || ipfsUrl.startsWith('https://')) {
    return ipfsUrl;
  }
  
  // If it's just a hash, prepend the gateway
  return `${IPFS_GATEWAY}${ipfsUrl}`;
}

// BaseScan URL helper
export function getBaseScanUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}

export function getBaseScanTokenUrl(tokenId: number): string {
  return `https://basescan.org/token/${CONTRACT_ADDRESS}?a=${tokenId}`;
}
