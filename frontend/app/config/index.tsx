import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, celo } from '@reown/appkit/networks';

// Get projectId from environment
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set');
}

// Metadata for Reown
export const metadata = {
  name: 'Mintly',
  description: 'Transform moments into memories on-chain',
  url: 'https:// To Be Updated .com', // Update with your actual domain
  icons: ['https:// To Be Updated .com'] // Update with your actual icon
};

// Configure chains - Base and Celo
export const networks = [base, celo];

// Create Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
});

export const config = wagmiAdapter.wagmiConfig;