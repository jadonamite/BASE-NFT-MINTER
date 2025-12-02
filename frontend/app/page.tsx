import Header from "@/app/components/Header";
import UserGallery from "@/app/components/UserGallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-32 px-4 max-w-7xl mx-auto pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Base <span className="text-blue-600">Minter</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your artwork, create metadata, and mint your own NFTs directly on the Base network.
          </p>
        </div>
        
        {/* We will add the <MintForm /> here later when Dev B finishes */}
        <div className="mb-16 p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center">
          <p className="text-gray-400 font-medium">Minting Form Area (Dev B)</p>
        </div>

        <UserGallery />
      </div>
    </main>
  );
}