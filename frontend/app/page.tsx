// app/page.tsx
import Header from './components/Header';
import StatsCounter from './components/StatsCounter';
import MintForm from './components/mint/MintForm';
import UserGallery from './components/UserGallery';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Mintly
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform moments into memories on-chain
          </p>
          
          {/* Gradient Line */}
          <div className="w-32 h-1 bg-gradient-to-r from-[#A6FFE7] to-[#64D9C5] mx-auto rounded-full mb-12" />
        </section>

        {/* Stats Counter */}
        <section className="mb-12 max-w-4xl mx-auto animate-fade-in">
          <StatsCounter />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto">
          {/* Mint Form */}
          <section className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Create Your NFT
            </h2>
            <p className="text-gray-600 mb-6">
              Upload your image, add details, and mint it on-chain in seconds
            </p>
            <MintForm />
          </section>

          {/* Gallery */}
          <section className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Mints
            </h2>
            <p className="text-gray-600 mb-6">
              Explore the latest NFTs created by our community
            </p>
            <UserGallery />
          </section>
        </div>

        {/* Footer Section */}
        <section className="mt-20 text-center text-gray-500 text-sm">
          <div className="mb-4">
            <p>Built on Base & Celo • By Web3Nova • Powered by Reown</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a 
              href="https://basescan.org/address/0x175357b6820C6d73CFBa870C662A24A9fB12eD6d" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#A6FFE7] transition-colors"
            >
              Base Contract
            </a>
            <span>•</span>
            <a 
              href="https://celoscan.io/address/0x5924C31FcA7d4545C8A48563B8e9ebbe61e0dCA5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#A6FFE7] transition-colors"
            >
              Celo Contract
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}