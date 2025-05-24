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

type KEYCHAIN = {
  [key: string]: string;
};
type KeychainList = Record<string, KEYCHAIN>;

export const YEETER_CONTRACTS: KeychainList = {
  ONBOARDER_SUMMONER: {
    "0x64": "0x313f9A3C9A5041e9be00cf88b18962581A4eFb35",
    "0xa": "0x2875aEbb4472E5E579a2A5290c7B5A3C90484D5F",
    "0xa4b1": "0x2875aEbb4472E5E579a2A5290c7B5A3C90484D5F",
    "0x2105": "0x2875aEbb4472E5E579a2A5290c7B5A3C90484D5F",
    "0xaa36a7": "0x2875aEbb4472E5E579a2A5290c7B5A3C90484D5F",
  },
  ETH_YEETER_SINGLETON: {
    "0x64": "0xbe056B4187387D1Cb503370FeA2815e42981DfdF",
    "0xa": "0x8D60971eFf778966356c1cADD76d525E7B25cc6b",
    "0xa4b1": "0x8D60971eFf778966356c1cADD76d525E7B25cc6b",
    "0x2105": "0x8D60971eFf778966356c1cADD76d525E7B25cc6b",
    "0xaa36a7": "0x62fF4Ca410E9e58f5ce8B2Ad03695EF0ad990381",
  },
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

export const WAGMI_CHAIN_OBJS_BY_ID: Record<string, Chain> = {
  1: mainnet,
  100: gnosis,
  8453: base,
  10: optimism,
  42161: arbitrum,
  137: polygon,
  11155111: sepolia,
};

export const getExplorerUrl = (chainid?: string): string | undefined => {
  return EXPLORER_URLS[chainid || ""];
};

export const getWagmiChainObj = (chainid?: string): Chain => {
  return WAGMI_CHAIN_OBJS[chainid || "0xaa36a7"];
};

export const HAUS_RPC_DEFAULTS: KEYCHAIN = {
  "0x1": `https://eth-mainnet.g.alchemy.com/v2/${
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  }`,
  "0x64": `https://gnosis-mainnet.g.alchemy.com/v2/${
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  }`,
  "0xa": `https://opt-mainnet.g.alchemy.com/v2/${
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  }`,
  "0xa4b1": `https://arb-mainnet.g.alchemy.com/v2/${
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  }`,
  "0xaa36a7": "https://eth-sepolia.g.alchemy.com/v2/demo",
  "0x2105": `https://base-mainnet.g.alchemy.com/v2/${
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  }`,
};

export const YEETER_SHAMAN_PERMISSIONS = "2";
export const DEFAULT_YEETER_VALUES = {
  isShares: false,
  feeRecipients: ["0xD0f8720846890a7961945261FE5012E4cA39918e"],
  feeAmounts: ["30000"],
  multiplier: "1000",
  minTribute: "1000000000000000",
};
export const DEFAULT_SUMMON_VALUES = {
  votingPeriodInSeconds: process.env.NEXT_PUBLIC_ENV === "local" ? 120 : 43200,
  gracePeriodInSeconds: process.env.NEXT_PUBLIC_ENV === "local" ? 60 : 21600,
  newOffering: "0",
  quorum: "0",
  sponsorThreshold: "1000000000000000000",
  minRetention: "66",
  votingTransferable: false,
  nvTransferable: false,
  shareAmounts: "1000000000000000000",
};
export const FEE_DISCLOSURE =
  "The Yeeter protocol fee is 3% on all contributions. Fees in the network's native token are sent to the Yeeter safe. These funds are used to maintain and enhance the platform while supporting the DAOhaus community.";

export const composeCastUrl = `https://farcaster.xyz/~/compose?text=&embeds[]=https://fundraiser.farcastle.net`;
