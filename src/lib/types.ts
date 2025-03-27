export type YeeterItem = {
  id: string;
  createdAt: string;
  dao: {
    id: string;
    name: string;
  };
  endTime: string;
  startTime: string;
  isShares: boolean;
  multiplier: string;
  minTribute: string;
  goal: string;
  balance: string;
  yeetCount: string;
  isActive: boolean;
  isEnded: boolean;
  isComingSoon: boolean;
  isFull: boolean;
  yeets?: YeetsItem[];
};

export type RecordItem = {
  createdAt: string;
  createdBy: string;
  content: string;
  contentType: string;
  tag: string;
  table: string;
  queryType: string;
  yeeterId: string;
  dao: {
    id: string;
    name: string;
  };
};

export type RecordItemParsed = RecordItem & {
  parsedContent?: Record<string, string>;
};

export type YeeterMetadata = {
  daoId: string;
  icon?: string;
  links?: string[];
  parsedLinks?: {
    url: string;
    label: string;
  }[];
  missionStatement?: string;
  projectDetails?: string;
  name?: string;
};

export type YeetsItem = {
  amount: string;
  contributor: string;
  createdAt: string;
  id: string;
  message: string;
  shares: string;
  yeeter: YeeterItem;
};

export type SummonParams = {
  daoName?: string;
  description?: string;
  tokenName?: string;
  tokenSymbol?: string;
  lootTokenName?: string;
  lootTokenSymbol?: string;
  votingTransferable?: boolean;
  nvTransferable?: boolean;
  quorum?: string;
  minRetention?: string;
  sponsorThreshold?: string;
  newOffering?: string;
  votingPeriod?: string;
  votingPeriodInSeconds?: number;
  gracePeriod?: string;
  gracePeriodInSeconds?: number;
  shamans?:
    | ""
    | {
        shamanAddresses: string[];
        shamanPermissions: string[];
      };
  members?:
    | ""
    | {
        memberAddresses: string[];
        memberShares: string[];
        memberLoot: string[];
      };
};

export type SubgraphQueryOrderPaginationOptions = {
  skip?: number;
  first?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
};

export type ShamanItem = {
  id: string;
  createdAt: string;
  shamanAddress: string;
  permissions: string;
};

export type VaultItem = {
  id: string;
  createdAt: string;
  active: string;
  ragequittable: string;
  name: string;
  safeAddress: string;
};

export type DaoItem = {
  id: string;
  createdAt: string;
  createdBy: string;
  txHash: string;
  safeAddress: string;
  lootPaused: boolean;
  sharesPaused: boolean;
  gracePeriod: string;
  votingPeriod: string;
  proposalOffering: string;
  quorumPercent: string;
  sponsorThreshold: string;
  minRetentionPercent: string;
  shareTokenName: string;
  shareTokenSymbol: string;
  sharesAddress: string;
  lootTokenName: string;
  lootTokenSymbol: string;
  lootAddress: string;
  totalShares: string;
  totalLoot: string;
  latestSponsoredProposalId: string;
  proposalCount: string;
  activeMemberCount: string;
  existingSafe: string;
  delegatedVaultManager: string;
  forwarder: string;
  referrer: string;
  name: string;
  rawProfile: RecordItem[];
  profile?: DaoProfile;
  shamen: ShamanItem[];
  vaults: VaultItem[];
};

export type DaoProfileLink = {
  label?: string;
  url?: string;
};
export type DaoProfile = {
  description?: string;
  longDescription?: string;
  avatarImg?: string;
  tags?: string[];
  links?: DaoProfileLink[];
};
export type ProposalItem = {
  id: string;
  createdAt: string;
  createdBy: string;
  proposedBy: string;
  txHash: string;
  proposalId: string;
  prevProposalId: string;
  proposalDataHash: string;
  proposalData: string;
  actionGasEstimate: string;
  details: string;
  title: string;
  description: string;
  proposalType: string;
  contentURI: string;
  contentURIType: string;
  currentlyPassing: boolean;
  sponsorTxHash: string;
  sponsored: boolean;
  selfSponsor: boolean;
  sponsor: string;
  sponsorTxAt: string;
  votingPeriod: string;
  votingStarts: string;
  votingEnds: string;
  gracePeriod: string;
  graceEnds: string;
  expiration: string;
  expirationQueryField: string;
  cancelledTxHash: string;
  cancelledBy: string;
  cancelled: boolean;
  cancelledTxAt: string;
  yesBalance: string;
  noBalance: string;
  yesVotes: string;
  noVotes: string;
  processTxHash: string;
  processedBy: string;
  processed: boolean;
  processTxAt: string;
  actionFailed: boolean;
  passed: boolean;
  proposalOffering: string;
  maxTotalSharesAndLootAtYesVote: string;
  tributeToken: string;
  tributeOffered: string;
  tributeTokenSymbol: string;
  tributeTokenDecimals: string;
  tributeEscrowRecipient: string;
  sponsorMembership: {
    memberAddress: string;
    shares: string;
    delegateShares: string;
  };
  dao: {
    totalShares: string;
    quorumPercent: string;
    minRetentionPercent: string;
  };
  votes: VoteItem;
};

export type VoteItem = {
  id: string;
  txHash: string;
  createdAt: string;
  daoAddress: string;
  approved: boolean;
  balance: string;
  member: {
    id: string;
    memberAddress: string;
  };
};

export type MemberItem = {
  id: string;
  createdAt: string;
  txHash: string;
  memberAddress: string;
  shares: string;
  loot: string;
  sharesLootDelegateShares: string;
  delegatingTo: string;
  delegateShares: string;
  delegateOfCount: string;
  lastDelegateUpdateTxHash: string;
  votes: {
    txHash: string;
    createdAt: string;
    approved: boolean;
    balance: string;
  };
};

export type WaitForReceipt = {
  logs: {
    topics: `0x${string}`[];
  }[];
};

export type TokenInfo = {
  decimals?: number;
  symbol?: string;
  name?: string;
  logoUri?: string | null;
};
export type TokenBalance = {
  token?: TokenInfo | null;
  tokenAddress: string | null;
  balance: string;
};

export type StatusRecord = {
  id: string;
  createdAt: string;
  parsedContent: {
    description: string;
    link: string;
    name: string;
  };
};

export type ExitItem = {
  id: string;
  createdAt: string;
  member: {
    memberAddress: string;
  };
  shares: string;
  loot: string;
  to: string;
};
