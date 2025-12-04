// Using NFT.Storage HTTP API directly (more reliable than SDK)

const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;

console.log('🔑 NFT Storage Key Check:', NFT_STORAGE_KEY ? 'Key exists ✅' : 'Key missing ❌');

if (!NFT_STORAGE_KEY) {
  throw new Error('NEXT_PUBLIC_NFT_STORAGE_API_KEY is not defined in environment variables');
}

/**
 * Upload image to IPFS via NFT.Storage HTTP API
 * @param file - The image file to upload
 * @returns IPFS URL (ipfs://Qm...)
 */
async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    console.log('📤 Starting image upload:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Use NFT.Storage upload endpoint
    const response = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NFT_STORAGE_KEY}`,
      },
      body: file,
    });

    console.log('📡 Upload response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check NEXT_PUBLIC_NFT_STORAGE_API_KEY');
      }
      
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Upload successful:', data);

    const cid = data.value.cid;
    return `ipfs://${cid}`;
    
  } catch (error: any) {
    console.error('❌ IPFS upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Upload JSON metadata to IPFS
 */
async function uploadJSONToIPFS(jsonData: any): Promise<string> {
  try {
    console.log('📤 Uploading JSON metadata...');

    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });

    const response = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NFT_STORAGE_KEY}`,
      },
      body: file,
    });

    console.log('📡 JSON upload response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ JSON upload failed:', errorText);
      throw new Error(`JSON upload failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ JSON upload successful:', data);

    const cid = data.value.cid;
    return `ipfs://${cid}`;
    
  } catch (error: any) {
    console.error('❌ JSON upload error:', error);
    throw new Error(`Failed to upload metadata: ${error.message}`);
  }
}

/**
 * Create and upload complete NFT metadata to IPFS
 * @param file - The image file
 * @param name - NFT name
 * @param description - NFT description
 * @param minterAddress - Address of the minter (optional)
 * @returns Complete metadata IPFS URL (ipfs://Qm...)
 */
export async function uploadNFTMetadata(
  file: File,
  name: string,
  description: string,
  minterAddress?: string
): Promise<string> {
  try {
    console.log('🚀 Starting NFT metadata upload...');
    console.log('📝 Metadata:', { name, description, minterAddress });

    // Step 1: Upload the image first
    const imageUrl = await uploadImageToIPFS(file);
    console.log('✅ Image uploaded:', imageUrl);

    // Step 2: Create metadata object
    const metadata = {
      name,
      description,
      image: imageUrl,
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

    console.log('📄 Metadata object created:', metadata);

    // Step 3: Upload metadata JSON
    const metadataUrl = await uploadJSONToIPFS(metadata);
    console.log('✅ Metadata uploaded:', metadataUrl);
    console.log('🎉 Complete upload successful!');

    return metadataUrl;

  } catch (error: any) {
    console.error('❌ NFT metadata upload failed:', error);
    throw error;
  }
}

/**
 * Fetch and parse metadata from IPFS URL
 * @param tokenURI - IPFS URL (ipfs://Qm...)
 * @returns Parsed NFT metadata
 */
export async function fetchNFTMetadata(tokenURI: string): Promise<any> {
  try {
    const httpUrl = tokenURI.replace('ipfs://', 'https://nftstorage.link/ipfs/');
    
    console.log('🔍 Fetching metadata from:', httpUrl);
    
    const response = await fetch(httpUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    
    const metadata = await response.json();
    console.log('✅ Metadata fetched:', metadata);
    
    return metadata;
    
  } catch (error: any) {
    console.error('❌ Error fetching NFT metadata:', error);
    throw new Error(`Failed to fetch NFT metadata: ${error.message}`);
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
    size: file.size,
  });

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPG, PNG, GIF, or WebP.');
  }

  if (file.size > MAX_SIZE) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  console.log('✅ File validation passed');
  return true;
}