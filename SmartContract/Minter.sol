// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BaseMinter
 * @dev Simple NFT minting contract with mint fee collection
 * @notice Users can mint NFTs by uploading images and paying a small fee
 */
 contract BaseMinter is ERC721URIStorage, Ownable, ReentrancyGuard {
    
    // State variables
    uint256 private _tokenIdCounter;
    uint256 public constant MINT_FEE = 0.0015 ether; // ~$6 at current ETH prices
    uint256 public totalFeesCollected;
    
    // Mappings
    mapping(address => uint256[]) private _userTokens;
    mapping(uint256 => address) private _tokenMinter;
    
    // Events
    event NFTMinted(
        address indexed minter,
        uint256 indexed tokenId,
        string tokenURI,
        uint256 timestamp
    );
    
    event FeesWithdrawn(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );
    
    /**
     * @dev Constructor sets NFT name and symbol
     */
    constructor() ERC721("BaseMint NFT", "BMINT") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }
    
    
    
    }