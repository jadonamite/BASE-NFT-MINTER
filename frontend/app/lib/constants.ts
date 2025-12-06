import { base, celo } from 'wagmi/chains';
import BaseMinterABI from '../abis/BaseMInter.json';

export const SUPPORTED_CHAINS = {
  base: {
    id: 8453,
    name: 'Base',
    chain: base,
    contractAddress: process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS || '0x175357b6820C6d73CFBa870C662A24A9fB12eD6d',
    explorer: 'https://basescan.org',
    currency: 'ETH',
  },
  celo: {
    id: 42220,
    name: 'Celo',
    chain: celo,
    contractAddress: process.env.NEXT_PUBLIC_CELO_CONTRACT_ADDRESS || '0x5924C31FcA7d4545C8A48563B8e9ebbe61e0dCA5',
    explorer: 'https://celoscan.io',
    currency: 'CELO',
  },
} as const;

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS;

/**
 * Get contract address for a specific chain
 */
export function getContractAddress(chainId: number): `0x${string}` {
  const chain = Object.values(SUPPORTED_CHAINS).find(c => c.id === chainId);
  return (chain?.contractAddress || SUPPORTED_CHAINS.base.contractAddress) as `0x${string}`;
}

/**
 * Get chain config by chain ID
 */
export function getChainConfig(chainId: number) {
  return Object.values(SUPPORTED_CHAINS).find(c => c.id === chainId) || SUPPORTED_CHAINS.base;
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerUrl(chainId: number, txHash: string): string {
  const config = getChainConfig(chainId);
  return `${config.explorer}/tx/${txHash}`;
}

/**
 * Get explorer URL for token
 */
export function getTokenUrl(chainId: number, tokenId: number): string {
  const config = getChainConfig(chainId);
  const address = getContractAddress(chainId);
  return `${config.explorer}/token/${address}?a=${tokenId}`;
}

// Change this line - remove .abi
export const CONTRACT_ABI = BaseMinterABI;

// Default to Base if no chain connected
export const DEFAULT_CHAIN_ID = SUPPORTED_CHAINS.base.id;
export const DEFAULT_CONTRACT_ADDRESS = SUPPORTED_CHAINS.base.contractAddress as `0x${string}`;

export const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

/**
 * Convert IPFS URI to HTTP gateway URL
 */
export function ipfsToHttp(uri: string): string {
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', IPFS_GATEWAY);
  }
  if (uri.startsWith('https://')) {
    return uri;
  }
  // Assume it's just the CID
  return `${IPFS_GATEWAY}${uri}`;
}

export const APP_CONFIG = {
  name: 'Mintly',
  description: 'Transform moments into memories on-chain',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'] as string[], // <-- Add "as string[]"
  recentMintsCount: 10,
} as const;

export const THEME = {
  primary: '#A6FFE7', // Teal accent
  primaryDark: '#064E3B',
  background: '#FAFAFA',
  cardDark: '#1E293B',
  border: '#E2E8F0',
} as const;