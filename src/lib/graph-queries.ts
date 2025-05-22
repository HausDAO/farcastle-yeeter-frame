import { gql } from "graphql-request";

const yeeterFields = `
  id
  createdAt
  dao {
    id
    lootTokenSymbol
  }
  endTime
  startTime
  isShares
  multiplier
  minTribute
  goal
  balance
  yeetCount
`;

export const FIND_YEETER = gql`
  query yeeter($shamanAddress: String!) {
    yeeter(id: $shamanAddress) {
      ${yeeterFields}
    }
  }
`;

export const FIND_YEETER_BY_TX = gql`
  query yeeter($txHash: String!) {
    yeeter(where: { txHash: $txHash }) {
      id
      createdAt
      txHash
    }
  }
`;

export const FIND_YEETER_EMBED = gql`
  query yeeter($shamanAddress: String!) {
    yeeter(id: $shamanAddress) {
      ${yeeterFields}
      yeets {
        id
        contributor
      }
    }
  }
`;

export const LIST_ALL_YEETERS = gql`
  {
    yeeters(
      first: 1000, 
      orderBy: createdAt, 
      orderDirection: desc,
    ) {
      ${yeeterFields}

    }
  }
`;

export const LIST_OPEN_YEETERS = gql`
  query yeeters($now: String!) {
    yeeters(
      first: 1000, 
      orderBy: createdAt, 
      orderDirection: desc,
      where: { endTime_gte: $now }
    ) {
      ${yeeterFields}

    }
  }
`;

export const LIST_CLOSED_YEETERS = gql`
  query yeeters($now: String!) {
    yeeters(
      first: 1000, 
      orderBy: createdAt, 
      orderDirection: desc,
      where: { endTime_lte: $now }
    ) {
      ${yeeterFields}

    }
  }
`;

export const LIST_YEETS = gql`
  query yeets($shamanAddress: String!) {
    yeets(
      where: { yeeter: $shamanAddress }
      orderBy: createdAt
      orderDirection: desc
      first: 1000
    ) {
      id
      createdAt
      contributor
      amount
      shares
      message
    }
  }
`;

// addtional where for the below if needed to scope to summoner referrer
// dao_: {
//   referrer: "${YEET24_REFERRER}"
// }

export const LIST_YEETS_FOR_ADDRESS = gql`
  query yeets($address: String!) {
    yeets(
      where: { contributor: $address }
      orderBy: createdAt
      orderDirection: desc
      first: 1000
    ) {
      id
      createdAt
      contributor
      amount
      shares
      message
      yeeter {
        ${yeeterFields}
      }
    }
  }
`;

export const FIND_YEETER_PROFILE = gql`
  query record($daoid: String!) {
    records(
      where: { dao: $daoid, table: "yeetDetails" }
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      createdAt
      createdBy
      tag
      table
      contentType
      content
      queryType
      dao {
        id
        name
      }
    }
    dao(id: $daoid) {
      id
      name
    }
  }
`;

const daoFields = `
  id
  createdAt
  createdBy
  txHash
  safeAddress
  lootPaused
  sharesPaused
  gracePeriod
  votingPeriod
  proposalOffering
  quorumPercent
  sponsorThreshold
  minRetentionPercent
  shareTokenName
  shareTokenSymbol
  sharesAddress
  lootTokenName
  lootTokenSymbol
  lootAddress
  totalShares
  totalLoot
  latestSponsoredProposalId
  proposalCount
  activeMemberCount
  existingSafe
  delegatedVaultManager
  forwarder
  referrer
  name
  rawProfile: records(
    first: 1
    orderBy: createdAt
    orderDirection: desc
    where: { table: "daoProfile" }
  ) {
    createdAt
    createdBy
    contentType
    content
  }
  shamen: shaman(
    orderBy: createdAt
    orderDirection: desc
  ) {
    id
    createdAt
    shamanAddress
    permissions
  }
  vaults (where: {active: true}){
    id
    createdAt
    active
    ragequittable
    name
    safeAddress
  }
`;

export const FIND_YEETER_PROFILE_DAO_EMBED = gql`
  query record($daoid: String!) {
    records(
      where: { dao: $daoid, table: "yeetDetails" }
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      createdAt
      createdBy
      tag
      table
      contentType
      content
      queryType
      dao {
        id
        name
      }
    }
    dao(id: $daoid) {
      id
      name
      members(where: { shares_gt: 0 }) {
        memberAddress
      }
    }
  }
`;

export const FIND_DAO = gql`
  query dao($daoid: String!) {
    dao(id: $daoid) {
      ${daoFields}
    }
  }
`;

export const FIND_DAO_LITE = gql`
  query dao($daoid: String!) {
    dao(id: $daoid) {
      id
      name
      rawProfile: records(where: { table: "daoProfile" }) {
        content
      }
    }
  }
`;

export const LIST_ALL_DAOS = gql`
  query dao(
    $skip: Int!
    $first: Int!
    $orderBy: String!
    $orderDirection: String!
  ) {
    daos(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDescription: $orderDescription
    ) {
      ${daoFields}
    }
  }
`;

// members(where: $address) {
// id
// createdAt
// memberAddress
// shares
// loot
// delegatingTo
// delegateShares
// delegateOfCount
// votes {
//   txHash
//   createdAt
//   approved
//   balance
// }
// }

export const SEARCH_DAOS = gql`
  query dao(
    $skip: Int!
    $first: Int!
    $orderBy: String!
    $orderDirection: String!
    $name: String!
  ) {
    daos(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDescription: $orderDescription
      where: { name_contains: $name }
    ) {
      ${daoFields}
    }
  }
`;

const proposalFields = `
  id
  createdAt
  createdBy
  proposedBy
  txHash
  proposalId
  prevProposalId
  proposalDataHash
  proposalData
  actionGasEstimate
  details
  title
  description
  proposalType
  contentURI
  contentURIType
  sponsorTxHash
  sponsored
  selfSponsor
  sponsor
  sponsorTxAt
  votingPeriod
  votingStarts
  votingEnds
  gracePeriod
  graceEnds
  expiration
  expirationQueryField
  cancelledTxHash
  cancelledBy
  cancelled
  cancelledTxAt
  yesBalance
  noBalance
  yesVotes
  noVotes
  processTxHash
  processedBy
  processed
  processTxAt
  actionFailed
  passed
  proposalOffering
  maxTotalSharesAndLootAtYesVote
  tributeToken
  tributeOffered
  tributeTokenSymbol
  tributeTokenDecimals
  tributeEscrowRecipient
  sponsorMembership {
    memberAddress
    shares
    delegateShares
  }
  dao {
    totalShares
    quorumPercent
    minRetentionPercent
  }
  votes {
    id
    txHash
    createdAt
    daoAddress
    approved
    balance
    member {
      id
      memberAddress
    }
  }
`;

export const FIND_PROPOSAL = gql`
  query proposal($proposalid: String!) {
    proposal(id: $proposalid) {
      ${proposalFields}
    }
  }
`;

export const LIST_ALL_DAO_PROPOSALS = gql`
  query proposal(
    $skip: Int!
    $first: Int!
    $orderBy: String!
    $orderDirection: String!
    $daoid: String!
  ) {
    proposals(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDescription: $orderDescription,
      where: { dao: $daoid }
    ) {
      ${proposalFields}
    }
  }
`;

export const LIST_ACTIVE_DAO_PROPOSALS = gql`
  query proposal(
    $skip: Int!
    $first: Int!
    $orderBy: String!
    $orderDirection: String!
    $daoid: String!
  ) {
    proposals(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDescription: $orderDescription,
      where: { 
        dao: $daoid           
        cancelled: false
        sponsored: true
        processed: false
        actionFailed: false 
      }
    ) {
      ${proposalFields}
    }
  }
`;

const memberFields = `
  id
  createdAt
  txHash
  memberAddress
  shares
  loot
  sharesLootDelegateShares
  delegatingTo
  delegateShares
  delegateOfCount
  lastDelegateUpdateTxHash
  votes {
    txHash
    createdAt
    approved
    balance
  }`;

export const FIND_MEMBER = gql`
  query member($memberid: String!) {
    member(id: $memberid) {
      ${memberFields}
    }
  }
`;

export const LIST_ALL_DAO_SHAREHOLDERS = gql`
  query member(
    $skip: Int!
    $first: Int!
    $orderBy: String!
    $orderDirection: String!
    $daoid: String!
  ) {
    members(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection,
      where: { dao: $daoid, shares_gt: 0 }
    ) {
      ${memberFields}
    }
  }
`;

export const LIST_ALL_DAO_MEMBERS = gql`
  query member(
    $skip: Int!
    $first: Int!
    $orderBy: String!
    $orderDirection: String!
    $daoid: String!
  ) {
    members(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDescription: $orderDescription,
      where: { dao: $daoid }
    ) {
      ${memberFields}
    }
  }
`;

export const LIST_ALL_DAOS_FOR_ADDRESS = gql`
  query dao(
    $address: String!
  ) {
    daos(
      first: 1000
      orderBy: createdAt
      orderDirection: desc
      where: { members_: { memberAddress: $address } }
    ) {
      ${daoFields}
      members(where: { memberAddress: $address }) {
        ${memberFields}
      }
    }
  }
`;
