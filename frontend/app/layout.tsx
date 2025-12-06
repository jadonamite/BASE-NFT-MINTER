// app/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Web3ModalProvider from "./context/Web3Modal";
import { Toaster } from 'react-hot-toast';
import { Space_Grotesk, Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: "Mintly - Transform moments into memories on-chain",
  description: "Mint your images as NFTs on Base and Celo networks with Mintly",
};

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading'
});

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body'
});
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");
  
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <Web3ModalProvider cookies={cookies}>
          {children}
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #334155',
                borderRadius: '0.75rem',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#A6FFE7',
                  secondary: '#064E3B',
                },
                style: {
                  border: '1px solid #A6FFE7',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
                style: {
                  border: '1px solid #EF4444',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#A6FFE7',
                  secondary: '#064E3B',
                },
              },
            }}
          />
        </Web3ModalProvider>
      </body>
    </html>
  );
}
