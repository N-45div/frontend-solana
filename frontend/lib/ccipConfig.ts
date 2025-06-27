// frontend/lib/ccipConfig.ts

import { PublicKey } from "@solana/web3.js";

/**
 * Supported Chain IDs for CCIP operations relevant to the frontend
 */
export enum ChainId {
  ETHEREUM_SEPOLIA = "ethereum-sepolia",
  SOLANA_DEVNET = "solana-devnet",
  // Add other chains here if the frontend needs to be aware of them
}

/**
 * Chain selectors used to identify chains in CCIP
 */
export const CHAIN_SELECTORS: Record<ChainId, bigint> = {
  [ChainId.ETHEREUM_SEPOLIA]: BigInt("16015286601757825753"),
  [ChainId.SOLANA_DEVNET]: BigInt("16423721717087811551"),
};

/**
 * Fee token types supported by CCIP
 */
export enum FeeTokenType {
  NATIVE = "native",
  WRAPPED_NATIVE = "wrapped-native",
  LINK = "link",
}

export interface FrontendSVMChainConfig {
  id: ChainId;
  name: string;
  routerProgramId: string; // Storing as string for simplicity, convert to PublicKey when used
  bnmTokenMint: string;    // Storing as string
  // Add other relevant SVM config fields here if needed by the frontend
}

export interface FrontendEVMChainConfig {
  id: ChainId;
  name: string;
  chainSelector: bigint;
  // Add other relevant EVM config fields here if needed by the frontend
}

const SVM_CONFIGS_FRONTEND: Record<ChainId.SOLANA_DEVNET, FrontendSVMChainConfig> = {
  [ChainId.SOLANA_DEVNET]: {
    id: ChainId.SOLANA_DEVNET,
    name: "Solana Devnet",
    routerProgramId: "Ccip842gzYHhvdDkSyi2YVCoAWPbYJoApMFzSxQroE9C",
    bnmTokenMint: "3PjyGzj1jGVgHSKS4VR1Hr1memm63PmN8L9rtPDKwzZ6", // BnM on Solana Devnet
  },
};

const EVM_CONFIGS_FRONTEND: Record<ChainId.ETHEREUM_SEPOLIA, FrontendEVMChainConfig> = {
    [ChainId.ETHEREUM_SEPOLIA]: {
        id: ChainId.ETHEREUM_SEPOLIA,
        name: "Ethereum Sepolia",
        chainSelector: CHAIN_SELECTORS[ChainId.ETHEREUM_SEPOLIA],
        // routerAddress: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", // Example if needed
        // bnmTokenAddress: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05", // Example if needed
    }
};


export function getFrontendCCIPSVMConfig(chainId: ChainId.SOLANA_DEVNET): FrontendSVMChainConfig {
  if (chainId !== ChainId.SOLANA_DEVNET) {
    throw new Error(`Unsupported SVM chain ID for frontend config: ${chainId}`);
  }
  return SVM_CONFIGS_FRONTEND[chainId];
}

export function getFrontendCCIPEVMConfig(chainId: ChainId.ETHEREUM_SEPOLIA): FrontendEVMChainConfig {
    if (chainId !== ChainId.ETHEREUM_SEPOLIA) {
        throw new Error(`Unsupported EVM chain ID for frontend config: ${chainId}`);
    }
    return EVM_CONFIGS_FRONTEND[chainId];
}

// Example token details - this should align with your form's needs
// You might fetch this from a more dynamic source or expand this list
export const frontendTokens = [
  {
    id: "bnm-solana-devnet",
    name: "BnM Token (Solana Devnet)",
    address: SVM_CONFIGS_FRONTEND[ChainId.SOLANA_DEVNET].bnmTokenMint,
    decimals: 9, // This needs to be accurate for the token
    chainId: ChainId.SOLANA_DEVNET,
  },
  // Add other tokens if your form supports them
];
