// NFT Metadata Structure (OpenSea Standard)
export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URL: ipfs://Qm...
  external_url?: string;
  attributes?: NFTAttribute[];
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

// For displaying NFTs in the gallery
export interface NFTDisplay {
  tokenId: number;
  owner: string;
  minter: string; // Original minter (from getTokenMinter)
  tokenURI: string; // Metadata IPFS URL
  metadata: NFTMetadata | null; // Parsed metadata (null if fetch fails)
  imageUrl: string; // Converted to https:// gateway URL
}

// Form data for minting
export interface MintFormData {
  name: string;
  description: string;
  file: File;
}

// Minting process states
export interface MintState {
  isUploading: boolean; // Uploading to IPFS
  isMinting: boolean; // Blockchain transaction pending
  isSuccess: boolean; // Mint completed successfully
  error: string | null;
  tokenId?: number;
  txHash?: string;
}

// Stats displayed on UI
export interface ContractStats {
  totalMinted: number; // Total NFTs minted by everyone
  userMintCount: number; // How many the current user has minted
  mintFee: string; // Dynamic mint fee from contract (in ETH)
}
