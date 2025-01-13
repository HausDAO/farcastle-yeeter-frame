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

type DaoConfigList = Record<string, DaoConfig>;

type DaoConfig = {
  DAO_ID: string;
  DAO_CHAIN: string;
  DAO_CHAIN_ID: number;
};

export const DAO_CONFIG: DaoConfigList = {
  "0x2a244bb4ccd4eb0897cf61e0c61963e1e1d161e3": {
    DAO_ID: "0x2a244bb4ccd4eb0897cf61e0c61963e1e1d161e3",
    DAO_CHAIN: "0xa",
    DAO_CHAIN_ID: optimism.id,
  },
  "0x33279f5046ca54365eb047f0758ceacdb85099e1": {
    DAO_ID: "0x33279f5046ca54365eb047f0758ceacdb85099e1",
    DAO_CHAIN: "0xaa36a7",
    DAO_CHAIN_ID: sepolia.id,
  },
};

export const getLocalDaoConfig = (): DaoConfig | undefined => {
  return DAO_CONFIG[process.env.NEXT_PUBLIC_DAO_ID || ""];
};

// export const HOLLOW_SERVANTS_DAO_ID =
// "0x2a244bb4ccd4eb0897cf61e0c61963e1e1d161e3";
// defaulting to sepolia dao during active dev
export const HOLLOW_SERVANTS_DAO_ID =
  "0x33279f5046ca54365eb047f0758ceacdb85099e1";

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
