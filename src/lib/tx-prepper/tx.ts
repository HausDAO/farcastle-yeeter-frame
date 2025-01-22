import { LOCAL_ABI } from "./abi/abis";
import { CONTRACT_KEYCHAINS } from "./contract-keychains";
import {
  NestedArray,
  ProposalTypeIds,
  TXLego,
  ValidArgType,
} from "./prepper-types";
import { buildMultiCallTX } from "./tx-prepper";

export const POSTER_TAGS = {
  summoner: "daohaus.summoner.daoProfile",
  daoProfileUpdate: "daohaus.shares.daoProfile",
  signalProposal: "daohaus.proposal.signalProposal",
  daoDatabaseProposal: "daohaus.proposal.database",
  daoDatabaseShares: "daohaus.shares.database",
  daoDatabaseSharesOrLoot: "daohaus.member.database",
};

const nestInArray = (arg: ValidArgType | ValidArgType[]): NestedArray => {
  return {
    type: "nestedArray",
    args: Array.isArray(arg) ? arg : [arg],
  };
};

export const TX: Record<string, TXLego> = {
  POST_SIGNAL: buildMultiCallTX({
    id: "POST_SIGNAL",
    JSONDetails: {
      type: "JSONDetails",
      jsonSchema: {
        title: `.formValues.title`,
        description: `.formValues.description`,
        contentURI: `.formValues.link`,
        contentURIType: { type: "static", value: "url" },
        proposalType: { type: "static", value: ProposalTypeIds.Signal },
      },
    },
    actions: [
      {
        contract: {
          type: "static",
          contractName: "Poster",
          abi: LOCAL_ABI.POSTER,
          targetAddress: CONTRACT_KEYCHAINS.POSTER,
        },
        method: "post",
        operations: { type: "static", value: 0 },
        args: [
          {
            type: "JSONDetails",
            jsonSchema: {
              daoId: ".daoId",
              table: { type: "static", value: "signal" },
              queryType: { type: "static", value: "list" },
              title: `.formValues.title`,
              description: `.formValues.description`,
              link: `.formValues.link`,
            },
          },
          { type: "static", value: POSTER_TAGS.daoDatabaseProposal },
        ],
      },
    ],
  }),
  SIGNAL_SHARES: buildMultiCallTX({
    id: "SIGNAL_SHARES",
    JSONDetails: {
      type: "JSONDetails",
      jsonSchema: {
        title: `.formValues.title`,
        description: `.formValues.description`,
        contentURI: `.formValues.link`,
        contentURIType: { type: "static", value: "url" },
        proposalType: {
          type: "static",
          value: ProposalTypeIds.IssueSharesLoot,
        },
      },
    },
    actions: [
      {
        contract: {
          type: "static",
          contractName: "Poster",
          abi: LOCAL_ABI.POSTER,
          targetAddress: CONTRACT_KEYCHAINS.POSTER,
        },
        method: "post",
        operations: { type: "static", value: 0 },
        args: [
          {
            type: "JSONDetails",
            jsonSchema: {
              daoId: ".daoId",
              table: { type: "static", value: "signal" },
              queryType: { type: "static", value: "list" },
              title: `.formValues.title`,
              description: `.formValues.description`,
              link: `.formValues.link`,
            },
          },
          { type: "static", value: POSTER_TAGS.daoDatabaseProposal },
        ],
      },
      {
        contract: {
          type: "static",
          contractName: "Current DAO (Baal)",
          abi: LOCAL_ABI.BAAL,
          targetAddress: ".daoId",
        },
        method: "mintShares",
        args: [
          nestInArray(".formValues.recipient"),
          nestInArray(".formValues.sharesRequested"),
        ],
      },
    ],
  }),
  REQUEST_MEMBERSHIP: buildMultiCallTX({
    id: "REQUEST_MEMBERSHIP",
    JSONDetails: {
      type: "JSONDetails",
      jsonSchema: {
        title: `.formValues.title`,
        description: `.formValues.description`,
        contentURI: `.formValues.link`,
        contentURIType: { type: "static", value: "url" },
        proposalType: {
          type: "static",
          value: ProposalTypeIds.IssueSharesLoot,
        },
      },
    },
    actions: [
      {
        contract: {
          type: "static",
          contractName: "Current DAO (Baal)",
          abi: LOCAL_ABI.BAAL,
          targetAddress: ".daoId",
        },
        method: "mintShares",
        args: [
          nestInArray(".formValues.recipient"),
          nestInArray(".formValues.sharesRequested"),
        ],
      },
      {
        contract: {
          type: "static",
          contractName: "Current DAO (Baal)",
          abi: LOCAL_ABI.BAAL,
          targetAddress: ".daoId",
        },
        method: "mintLoot",
        args: [
          nestInArray(".formValues.recipient"),
          nestInArray(".formValues.lootRequested"),
        ],
      },
    ],
  }),
};
