import { PinataSDK } from 'pinata-web3';

// Initialize Pinata client
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

if (!PINATA_JWT) {
  console.error('❌ PINATA_JWT is not defined in environment variables');
}

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
});

console.log(' Pinata Key initialized:', PINATA_JWT ? 'Verified' : 'Failed');

/**
 * Upload image file to IPFS via Pinata
 * @param file - The image file to upload
 * @returns IPFS CID (Qm...)
 */
async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    console.log(' Uploading image to Pinata:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    });

    const upload = await pinata.upload.file(file);
    
    console.log('Passed: Image uploaded successfully');
    console.log('📍 CID:', upload.IpfsHash);

    return upload.IpfsHash;
    
  } catch (error: any) {
    console.error('❌ Image upload failed:', error);
    
    if (error.message?.includes('Invalid authentication')) {
      throw new Error('Invalid Pinata API key. Check your .env.local file.');
    }
    
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param metadata - The metadata object
 * @returns IPFS CID (Qm...)
 */
async function uploadJSONToIPFS(metadata: any): Promise<string> {
  try {
    console.log('📤 Uploading metadata JSON to Pinata...');

    const upload = await pinata.upload.json(metadata);
    
    console.log('✅ Metadata uploaded successfully');
    console.log('📍 CID:', upload.IpfsHash);

    return upload.IpfsHash;
    
  } catch (error: any) {
    console.error('❌ Metadata upload failed:', error);
    throw new Error(`Failed to upload metadata: ${error.message}`);
  }
}

/**
 * Main function: Upload image + metadata to IPFS
 * @param file - The image file
 * @param name - NFT name
 * @param description - NFT description
 * @param minterAddress - Optional minter address
 * @returns Metadata IPFS URI (ipfs://Qm...)
 */
export async function uploadNFTMetadata(
  file: File,
  name: string,
  description: string,
  minterAddress?: string
): Promise<string> {
  try {
    console.log('🚀 Starting NFT upload process...');
    console.log('📝 NFT Details:', { name, description });

    // Step 1: Upload image
    const imageCID = await uploadImageToIPFS(file);
    const imageURI = `ipfs://${imageCID}`;
    console.log('✅ Image URI:', imageURI);

    // Step 2: Create metadata
    const metadata = {
      name,
      description,
      image: imageURI,
      external_url: typeof window !== 'undefined' ? window.location.origin : '',
      attributes: [
        {
          trait_type: 'Minted By',
          value: minterAddress || 'Unknown',
        },
        {
          trait_type: 'Mint Date',
          value: new Date().toISOString().split('T')[0],
        },
        {
          trait_type: 'Platform',
          value: 'BaseMint',
        },
      ],
    };

    console.log('📄 Metadata created:', metadata);

    // Step 3: Upload metadata
    const metadataCID = await uploadJSONToIPFS(metadata);
    const metadataURI = `ipfs://${metadataCID}`;
    
    console.log('✅ Metadata URI:', metadataURI);
    console.log('🎉 Upload complete!');

    return metadataURI;
    
  } catch (error: any) {
    console.error('❌ NFT upload failed:', error);
    throw error;
  }
}

/**
 * Fetch metadata from IPFS
 * @param tokenURI - IPFS URI (ipfs://Qm...)
 * @returns Parsed metadata object
 */
export async function fetchNFTMetadata(tokenURI: string): Promise<any> {
  try {
    // Convert ipfs:// to https:// gateway
    const httpUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    
    console.log('🔍 Fetching metadata from:', httpUrl);
    
    const response = await fetch(httpUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const metadata = await response.json();
    console.log('✅ Metadata fetched:', metadata);
    
    return metadata;
    
  } catch (error: any) {
    console.error('❌ Failed to fetch metadata:', error);
    throw new Error(`Failed to fetch metadata: ${error.message}`);
  }
}

/**
 * Validate image file before upload
 * @param file - File to validate
 * @returns true if valid, throws error otherwise
 */
export function validateImageFile(file: File): boolean {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  console.log('🔍 Validating file:', {
    name: file.name,
    type: file.type,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
  });

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.');
  }

  if (file.size > MAX_SIZE) {
    throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum size is 10 MB.`);
  }

  console.log('✅ File validation passed');
  return true;
}

/**
 * Helper: Convert IPFS URI to HTTP gateway URL
 * @param ipfsUrl - IPFS URI (ipfs://...)
 * @returns HTTP gateway URL
 */
export function getIPFSGatewayUrl(ipfsUrl: string): string {
  if (!ipfsUrl) return '';
  
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
  }
  
  if (ipfsUrl.startsWith('http://') || ipfsUrl.startsWith('https://')) {
    return ipfsUrl;
  }
  
  // If it's just a CID
  return `https://gateway.pinata.cloud/ipfs/${ipfsUrl}`;
}