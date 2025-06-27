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
    "0x64": "0xd55ce418a17418fe36254ad71c25f87aa97afc85",
    "0xa": "0xdbD69005afF25Ec2B458125697580B997C5f7c58",
    "0xa4b1": "0x24c2cA1152AbE7F34b4ecD82A3D1D18876533620",
    "0x2105": "0x788C55D87a416F391E93a986AbB1e2b2960d0079",
    "0xaa36a7": "0xFb3610917A8f9F0866024a19d8C40fBC3BEbA54b",
  },
  ETH_YEETER_SINGLETON: {
    "0x64": "0x4b0f17aF019E54031Ca1Ad14bDdd3F4C1ea22F05",
    "0xa": "0x21E2d492d367780Ab736bD0600164AC3D5D20bD2",
    "0xa4b1": "0x97d7753882f8bab3e96efd9a8a17ca1c769cd7cc",
    "0x2105": "0xBAb498fB934fE1661Bb707DFF1730BaE12a1a691",
    "0xaa36a7": "0xDEdF14E5d3B29411801cBF80a8b1939D2E45f58c",
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
  votingPaused: true,
  nvPaused: true,
  shareAmounts: "1000000000000000000",
};
export const FEE_DISCLOSURE =
  "The Yeeter protocol fee is 3% on all contributions. Fees in the network's native token are sent to the Yeeter safe. These funds are used to maintain and enhance the platform while supporting the DAOhaus community.";

export const composeCastUrl = `https://farcaster.xyz/~/compose?text=&embeds[]=https://fundraiser.farcastle.net`;
