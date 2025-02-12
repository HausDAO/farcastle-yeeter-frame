import {
  base,
  sepolia,
  mainnet,
  polygon,
  gnosis,
  optimism,
  arbitrum,
  Chain,
} from "wagmi/chains";

export const EXPLORER_URLS: Record<string, string> = {
  "0x1": "https://etherscan.io",
  "0x64": "https://gnosisscan.io",
  "0x89": "https://polygonscan.com",
  "0xa": "https://optimistic.etherscan.io",
  "0xa4b1": "https://arbiscan.io",
  "0xaa36a7": "https://sepolia.etherscan.io",
  "0x2105": "https://basescan.org",
};

export const WAGMI_CHAIN_OBJS: Record<string, Chain> = {
  "0x1": mainnet,
  "0x64": gnosis,
  "0x89": polygon,
  "0xa": optimism,
  "0xa4b1": arbitrum,
  "0xaa36a7": sepolia,
  "0x2105": base,
};

export const getExplorerUrl = (chainid?: string): string | undefined => {
  return EXPLORER_URLS[chainid || ""];
};

export const getWagmiChainObj = (chainid?: string): Chain => {
  return WAGMI_CHAIN_OBJS[chainid || "0xaa36a7"];
};
