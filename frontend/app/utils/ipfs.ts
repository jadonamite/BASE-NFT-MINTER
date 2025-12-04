// import { NFTStorage, File as NFTFile } from 'nft.storage';

// // Initialize NFT.Storage client
// const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;

// if (!NFT_STORAGE_KEY) {
//   throw new Error('NFT_STORAGE_API_KEY is not defined in environment variables');
// }

// const client = new NFTStorage({ token: NFT_STORAGE_KEY });

// /**
//  * Upload image to IPFS via NFT.Storage
//  * @param file - The image file to upload
//  * @returns IPFS URL (ipfs://Qm...)
//  */
// async function uploadImageToIPFS(file: File): Promise<string> {
//   try {
//     // Convert browser File to NFT.Storage File
//     const buffer = await file.arrayBuffer();
//     const nftFile = new NFTFile([buffer], file.name, { type: file.type });

//     // Upload to IPFS
//     const cid = await client.storeBlob(nftFile);
    
//     return `ipfs://${cid}`;
//   } catch (error) {
//     console.error('Error uploading image to IPFS:', error);
//     throw new Error('Failed to upload image to IPFS');
//   }
// }

// /**
//  * Create and upload complete NFT metadata to IPFS
//  * @param file - The image file
//  * @param name - NFT name
//  * @param description - NFT description
//  * @param minterAddress - Address of the minter (optional)
//  * @returns Complete metadata IPFS URL (ipfs://Qm...)
//  */
// export async function uploadNFTMetadata(
//   file: File,
//   name: string,
//   description: string,
//   minterAddress?: string
// ): Promise<string> {
//   try {
//     // Step 1: Upload the image first
//     console.log('📤 Uploading image to IPFS...');
//     const imageUrl = await uploadImageToIPFS(file);
//     console.log('✅ Image uploaded:', imageUrl);

//     // Step 2: Create metadata object
//     const metadata = {
//       name,
//       description,
//       image: imageUrl,
//       external_url: typeof window !== 'undefined' ? window.location.origin : '',
//       attributes: [
//         {
//           trait_type: 'Minted By',
//           value: minterAddress || 'Unknown',
//         },
//         {
//           trait_type: 'Mint Date',
//           value: new Date().toISOString().split('T')[0], // YYYY-MM-DD
//         },
//         {
//           trait_type: 'Platform',
//           value: 'BaseMint',
//         },
//       ],
//     };

//     // Step 3: Upload metadata JSON
//     console.log('📤 Uploading metadata to IPFS...');
//     const metadataString = JSON.stringify(metadata);
//     const metadataFile = new NFTFile(
//       [metadataString],
//       'metadata.json',
//       { type: 'application/json' }
//     );

//     const metadataCid = await client.storeBlob(metadataFile);
//     const metadataUrl = `ipfs://${metadataCid}`;
    
//     console.log('✅ Metadata uploaded:', metadataUrl);
//     return metadataUrl;

//   } catch (error) {
//     console.error('Error uploading NFT metadata:', error);
//     throw new Error('Failed to upload NFT metadata to IPFS');
//   }
// }

// /**
//  * Fetch and parse metadata from IPFS URL
//  * @param tokenURI - IPFS URL (ipfs://Qm...)
//  * @returns Parsed NFT metadata
//  */
// export async function fetchNFTMetadata(tokenURI: string): Promise<any> {
//   try {
//     // Convert ipfs:// to https:// gateway URL
//     const httpUrl = tokenURI.replace('ipfs://', 'https://nftstorage.link/ipfs/');
    
//     const response = await fetch(httpUrl);
    
//     if (!response.ok) {
//       throw new Error(`Failed to fetch metadata: ${response.statusText}`);
//     }
    
//     const metadata = await response.json();
//     return metadata;
    
//   } catch (error) {
//     console.error('Error fetching NFT metadata:', error);
//     throw new Error('Failed to fetch NFT metadata from IPFS');
//   }
// }

// /**
//  * Validate image file before upload
//  * @param file - File to validate
//  * @returns true if valid, throws error otherwise
//  */
// export function validateImageFile(file: File): boolean {
//   const MAX_SIZE = 10 * 1024 * 1024; // 10MB
//   const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

//   if (!ALLOWED_TYPES.includes(file.type)) {
//     throw new Error('Invalid file type. Please upload JPG, PNG, GIF, or WebP.');
//   }

//   if (file.size > MAX_SIZE) {
//     throw new Error('File too large. Maximum size is 10MB.');
//   }

//   return true;
// }
import { NFTStorage, File as NFTFile } from 'nft.storage';

// Initialize NFT.Storage client
const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;

console.log('🔑 NFT Storage Key Check:', NFT_STORAGE_KEY ? 'Key exists ✅' : 'Key missing ❌');

if (!NFT_STORAGE_KEY) {
  throw new Error('NEXT_PUBLIC_NFT_STORAGE_API_KEY is not defined in environment variables');
}

const client = new NFTStorage({ token: NFT_STORAGE_KEY });

/**
 * Upload image to IPFS via NFT.Storage
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

    // Convert browser File to NFT.Storage File
    const buffer = await file.arrayBuffer();
    console.log('✅ File converted to buffer, size:', buffer.byteLength);

    const nftFile = new NFTFile([buffer], file.name, { type: file.type });
    console.log('✅ NFTFile created');

    // Upload to IPFS
    console.log('📡 Uploading to NFT.Storage...');
    const cid = await client.storeBlob(nftFile);
    console.log('✅ Upload successful! CID:', cid);
    
    return `ipfs://${cid}`;
  } catch (error: any) {
    console.error('❌ Detailed IPFS upload error:', {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      response: error?.response,
      fullError: error,
    });
    
    // Provide more specific error messages
    if (error?.status === 401 || error?.message?.includes('401')) {
      throw new Error('Invalid NFT.Storage API key. Please check your .env.local file.');
    }
    
    if (error?.status === 403 || error?.message?.includes('403')) {
      throw new Error('NFT.Storage API key does not have permission. Generate a new key.');
    }
    
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      throw new Error('Network error. Check your internet connection.');
    }

    throw new Error(`Failed to upload image to IPFS: ${error?.message || 'Unknown error'}`);
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
    // Step 1: Upload the image first
    console.log('🚀 Starting NFT metadata upload...');
    console.log('📝 Metadata:', { name, description, minterAddress });
    
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
          value: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        },
        {
          trait_type: 'Platform',
          value: 'BaseMint',
        },
      ],
    };

    console.log('📄 Metadata object created:', metadata);

    // Step 3: Upload metadata JSON
    console.log('📤 Uploading metadata JSON to IPFS...');
    const metadataString = JSON.stringify(metadata);
    const metadataFile = new NFTFile(
      [metadataString],
      'metadata.json',
      { type: 'application/json' }
    );

    const metadataCid = await client.storeBlob(metadataFile);
    const metadataUrl = `ipfs://${metadataCid}`;
    
    console.log('✅ Metadata uploaded:', metadataUrl);
    console.log('🎉 Complete upload successful!');
    
    return metadataUrl;

  } catch (error: any) {
    console.error('❌ NFT metadata upload failed:', error);
    throw error; // Re-throw to preserve the detailed error
  }
}

/**
 * Fetch and parse metadata from IPFS URL
 * @param tokenURI - IPFS URL (ipfs://Qm...)
 * @returns Parsed NFT metadata
 */
export async function fetchNFTMetadata(tokenURI: string): Promise<any> {
  try {
    // Convert ipfs:// to https:// gateway URL
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
    throw new Error(`Failed to fetch NFT metadata from IPFS: ${error?.message}`);
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