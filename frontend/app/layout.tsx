import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Web3ModalProvider from "./context/Web3Modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Base NFT Minter",
  description: "Mint unique assets on the Base Network",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");

  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ModalProvider cookies={cookies}>
          {children}
        </Web3ModalProvider>
      </body>
    </html>
  );
}