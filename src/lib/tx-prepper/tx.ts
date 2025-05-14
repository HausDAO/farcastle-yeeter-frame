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
            },
          },
          { type: "static", value: POSTER_TAGS.daoDatabaseProposal },
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
  REQUEST_FUNDING: buildMultiCallTX({
    id: "REQUEST_FUNDING",
    JSONDetails: {
      type: "JSONDetails",
      jsonSchema: {
        title: ".formValues.title",
        description: ".formValues.description",
        contentURI: `.formValues.link`,
        contentURIType: { type: "static", value: "url" },
        proposalType: {
          type: "static",
          value: ProposalTypeIds.TransferErc20,
        },
      },
    },
    actions: [
      {
        contract: {
          type: "static",
          contractName: "ERC20",
          abi: LOCAL_ABI.ERC20,
          targetAddress: ".formValues.tokenAddress",
        },
        method: "transfer",
        args: [".formValues.recipient", ".formValues.tokenAmount"],
      },
    ],
  }),
  REQUEST_FUNDING_ETH: buildMultiCallTX({
    id: "ISSUE_NETWORK_TOKEN",
    JSONDetails: {
      type: "JSONDetails",
      jsonSchema: {
        title: ".formValues.title",
        description: ".formValues.description",
        contentURI: `.formValues.link`,
        contentURIType: { type: "static", value: "url" },
        proposalType: {
          type: "static",
          value: ProposalTypeIds.TransferNetworkToken,
        },
      },
    },
    actions: [
      {
        contract: {
          type: "static",
          contractName: "NETWORK",
          abi: LOCAL_ABI.ERC20,
          targetAddress: ".formValues.recipient",
        },
        method: "noMethod",
        args: [],
        value: ".formValues.tokenAmount",
        data: {
          type: "static",
          value: "0x",
        },
      },
    ],
  }),
  UPDATE_YEET_METADATA_SETTINGS: {
    id: "UPDATE_YEET_METADATA_SETTINGS",
    contract: {
      type: "static",
      contractName: "Poster",
      abi: LOCAL_ABI.POSTER,
      targetAddress: CONTRACT_KEYCHAINS.POSTER,
    },
    method: "post",
    args: [
      {
        type: "JSONDetails",
        jsonSchema: {
          daoId: ".daoId",
          table: { type: "static", value: "yeetDetails" },
          queryType: { type: "static", value: "latest" },
          name: ".formValues.name",
          projectDetails: ".formValues.projectDetails",
          missionStatement: ".formValues.missionStatement",
          yeeterId: ".formValues.yeeterid",
          icon: ".formValues.icon",
          rewards: {
            type: "nestedArray",
            args: [
              {
                type: "JSONDetails",
                jsonSchema: {
                  rewardLevel: ".formValues.rewardLevel1",
                  details: ".formValues.rewardLevel1Details",
                },
              },
              {
                type: "JSONDetails",
                jsonSchema: {
                  rewardLevel: ".formValues.rewardLevel2",
                  details: ".formValues.rewardLevel2Details",
                },
              },
            ],
          },
          links: {
            type: "nestedArray",
            args: [
              {
                type: "JSONDetails",
                jsonSchema: {
                  url: ".formValues.discord",
                  label: { type: "static", value: "Discord" },
                },
              },
              {
                type: "JSONDetails",
                jsonSchema: {
                  url: ".formValues.github",
                  label: { type: "static", value: "Github" },
                },
              },
              {
                type: "JSONDetails",
                jsonSchema: {
                  url: ".formValues.blog",
                  label: { type: "static", value: "Blog" },
                },
              },
              {
                type: "JSONDetails",
                jsonSchema: {
                  url: ".formValues.telegram",
                  label: { type: "static", value: "Telegram" },
                },
              },
              {
                type: "JSONDetails",
                jsonSchema: {
                  url: ".formValues.twitter",
                  label: { type: "static", value: "Twitter" },
                },
              },
              {
                type: "JSONDetails",
                jsonSchema: {
                  url: ".formValues.web",
                  label: { type: "static", value: "Web" },
                },
              },
              {
                type: "JSONDetails",
                jsonSchema: {
                  url: ".formValues.custom1",
                  label: ".formValues.custom1Label",
                },
              },
              {
                type: "JSONDetails",
                jsonSchema: {
                  url: ".formValues.custom2",
                  label: ".formValues.custom2Label",
                },
              },
              {
                type: "JSONDetails",
                jsonSchema: {
                  url: ".formValues.custom3",
                  label: ".formValues.custom3Label",
                },
              },
            ],
          },
        },
      },
      { type: "static", value: POSTER_TAGS.daoDatabaseShares },
    ],
  },
};
