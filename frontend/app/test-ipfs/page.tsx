'use client';

import { useState } from 'react';
import { uploadNFTMetadata } from '../utils/ipfs';

console.log('🔑 Environment Check:');
console.log('Reown ID:', process.env.NEXT_PUBLIC_REOWN_PROJECT_ID);
console.log('NFT Storage:', process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY);
console.log('Contract:', process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
console.log('Network:', process.env.NEXT_PUBLIC_NETWORK);

export default function TestIPFS() {
  const [status, setStatus] = useState('');

  const handleTest = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        setStatus('Uploading...');
        const uri = await uploadNFTMetadata(file, 'Test NFT', 'Testing IPFS');
        setStatus(`Success! URI: ${uri}`);
        console.log('Token URI:', uri);
      } catch (error: any) {
        setStatus(`Error: ${error.message}`);
      }
    };
console.log('Reown Project ID:', process.env.NEXT_PUBLIC_REOWN_PROJECT_ID);
    input.click();
  };

  return (
    <div className="p-8">
      <button onClick={handleTest} className="px-4 py-2 bg-blue-500 text-white rounded">
        Test IPFS Upload
      </button>
      <p className="mt-4">{status}</p>
    </div>
  );
}