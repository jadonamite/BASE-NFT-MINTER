import Header from "@/app/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover & Mint NFTs on Base
          </h1>
          <p className="text-lg text-gray-600">
            Connect your wallet to get started.
          </p>
        </div>
        
        {/* Gallery will go here later */}
        <div className="p-10 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-400">
          User Gallery Component Loading...
        </div>
      </div>
    </main>
  );
}