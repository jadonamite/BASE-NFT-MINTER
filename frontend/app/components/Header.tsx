export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">
              BaseMinter
            </span>
          </div>

          {/* Wallet Button */}
          <div className="flex items-center gap-4">
            <appkit-button />
          </div>
        </div>
      </div>
    </header>
  );
}