// import Header from "@/app/components/Header";
// import UserGallery from "@/app/components/UserGallery";

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-gray-50">
//       <Header />
      
//       <div className="pt-32 px-4 max-w-7xl mx-auto pb-20">
//         <div className="text-center mb-16">
//           <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
//             Base <span className="text-blue-600">Minter</span>
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Upload your artwork, create metadata, and mint your own NFTs directly on the Base network.
//           </p>
//         </div>
        
//         {/* We will add the <MintForm /> here later when Dev B finishes */}
//         <div className="mb-16 p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center">
//           <p className="text-gray-400 font-medium">Minting Form Area (Dev B)</p>
//         </div>

//         <UserGallery />
//       </div>
//     </main>
//   );
// }
'use client';

import { useState } from 'react';
import { uploadNFTMetadata } from '@/app/utils/ipfs';

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
console.log('Reown Project ID:', process.env.NEXT_PUBLIC_PROJECT_ID);
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