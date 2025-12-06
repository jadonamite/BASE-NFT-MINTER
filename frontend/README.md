# Mintly

Multi-chain NFT minting platform. Upload images, mint as NFTs on Base and Celo networks.

## Features

- Drag & drop image upload
- Multi-chain support (Base + Celo)
- IPFS storage via Pinata
- Clean, modern UI with teal accents
- Real-time minting statistics
- Toast notifications
- Mobile responsive

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Web3:** Wagmi v2, Viem, Reown AppKit
- **Storage:** Pinata (IPFS)
- **Styling:** Tailwind CSS
- **Icons:** Heroicons

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=0x175357b6820C6d73CFBa870C662A24A9fB12eD6d
NEXT_PUBLIC_CELO_CONTRACT_ADDRESS=0x5924C31FcA7d4545C8A48563B8e9ebbe61e0dCA5
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

## Smart Contracts

| Network | Address |
|---------|---------|
| Base | `0x175357b6820C6d73CFBa870C662A24A9fB12eD6d` |
| Celo | `0x5924C31FcA7d4545C8A48563B8e9ebbe61e0dCA5` |

## Mint Fees

- **Base:** 0.0000175 ETH
- **Celo:** 0.3 CELO

## How It Works

1. Connect wallet (Base or Celo)
2. Upload image (JPG, PNG, GIF, WebP - max 10MB)
3. Add NFT name and description
4. Click "Mint NFT"
5. Approve transaction
6. View your NFT in the gallery

## Project Structure

```
app/
├── components/
│   ├── Header.tsx              # Navigation + wallet connect
│   ├── StatsCounter.tsx        # Minting statistics
│   ├── UserGallery.tsx         # NFT gallery display
│   └── mint/
│       ├── ImagePreview.tsx    # Image preview component
│       ├── MintForm.tsx        # Main minting form
│       └── SuccessModal.tsx    # Success celebration
├── hooks/
│   ├── useMint.ts              # Minting logic
│   ├── useMintFee.ts           # Fee reading
│   └── useNFTData.ts           # NFT data fetching
├── lib/
│   └── constants.ts            # Contract config
├── utils/
│   └── ipfs.ts                 # IPFS upload logic
└── config/
    └── index.tsx               # Wagmi/Reown config
```

## Configuration

### Supported File Types
- JPG/JPEG
- PNG
- GIF
- WebP

### File Size Limit
- Maximum: 10MB

### Supported Networks
- Base Mainnet (Chain ID: 8453)
- Celo Mainnet (Chain ID: 42220)

## Development

### Install Additional Dependencies
```bash
npm install @heroicons/react react-hot-toast
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

## Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

Add environment variables in Vercel dashboard under Settings → Environment Variables.

## Links

- [Base Contract on BaseScan](https://basescan.org/address/0x175357b6820C6d73CFBa870C662A24A9fB12eD6d)
- [Celo Contract on CeloScan](https://celoscan.io/address/0x5924C31FcA7d4545C8A48563B8e9ebbe61e0dCA5)
- [Reown Cloud](https://cloud.reown.com)
- [Pinata Dashboard](https://app.pinata.cloud)

## License

MIT

## Support

For issues or questions, check browser console for errors and verify environment variables are set correctly.
