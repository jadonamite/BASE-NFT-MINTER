'use client'

import { useNFTData } from "@/app/hooks/useNFTData";
import { useAccount } from "wagmi";

export default function UserGallery() {
  const { isConnected } = useAccount();
  const { nfts, loading } = useNFTData();

  // State 1: Wallet not connected
  if (!isConnected) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-medium text-gray-900">Connect Wallet</h3>
        <p className="text-gray-500 mt-2">Connect your wallet to view your collection.</p>
      </div>
    );
  }

  // State 2: Loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-80 w-full"></div>
        ))}
      </div>
    );
  }

  // State 3: No NFTs found
  if (nfts.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-medium text-gray-900">No NFTs Found</h3>
        <p className="text-gray-500 mt-2">You haven't minted any art yet!</p>
      </div>
    );
  }

  // State 4: Display Grid
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <div 
            key={nft.id} 
            className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Image Container */}
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              {nft.metadata?.image ? (
                <img 
                  src={nft.metadata.image} 
                  alt={nft.metadata.name || `NFT #${nft.id}`}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  // Fallback for broken images
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Error+Loading+Image'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Info Container */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 truncate pr-2">
                  {nft.metadata?.name || 'Untitled'}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  #{nft.id}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 h-10">
                {nft.metadata?.description || 'No description provided.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}