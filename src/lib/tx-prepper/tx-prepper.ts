import { LOCAL_ABI } from "./abi/abis";
import { processArgs } from "./args-handlers";
import { processContractLego } from "./contracts";
import {
  ABI,
  ArbitraryState,
  ArgCallback,
  EthAddress,
  JSONDetailsSearch,
  Keychain,
  MulticallAction,
  StringSearch,
  TXLego,
  ValidNetwork,
} from "./prepper-types";

export const BaalContractBase = {
  type: "local",
  contractName: "Baal",
  abi: LOCAL_ABI.BAAL,
};
export const EXPIRY = ".proposalExpiry";
export const FORM = ".formValues";
export const CURRENT_DAO = ".daoId";
export const basicDetails: JSONDetailsSearch = {
  type: "JSONDetails",
  jsonSchema: {
    title: ".formValues.title",
    description: ".formValues.description",
    proposalType: { type: "static", value: "Multicall Proposal" },
  },
};

export async function prepareTX(args: {
  tx: TXLego;
  chainId: ValidNetwork;
  safeId?: string;
  appState: ArbitraryState;
  localABIs: Record<string, ABI>;
  argCallbackRecord: Record<string, ArgCallback>;
}) {
  const { argCallbackRecord, tx, chainId, safeId, localABIs, appState } = args;
  console.log("**APPLICATION STATE**", appState);
  try {
    const processedContract = await processContractLego({
      localABIs,
      contract: tx.contract,
      chainId,
      appState,
    });
    console.log("**PROCESSED CONTRACT**", processedContract);

    const { abi, address } = processedContract;
    const { method } = tx;

    const processedArgs = await processArgs({
      tx: { ...tx, contract: processedContract },
      localABIs,
      chainId,
      safeId,
      appState,
      argCallbackRecord,
    });

    console.log("**PROCESSED ARGS**", processedArgs);

    return {
      address: address as `0x${string}`,
      functionName: method,
      args: processedArgs,
      abi,
    };
  } catch (error) {
    console.error(error);
  }
}

export const buildMultiCallTX = ({
  id,
  baalAddress = CURRENT_DAO,
  actions,
  JSONDetails = basicDetails,
  formActions = false,
  gasBufferPercentage,
}: {
  id: string;
  baalAddress?: StringSearch | Keychain | EthAddress;
  JSONDetails?: JSONDetailsSearch;
  actions: MulticallAction[];
  formActions?: boolean;
  gasBufferPercentage?: number;
}): TXLego => {
  return {
    id,
    method: "submitProposal",
    contract: {
      ...BaalContractBase,
      type: "static",
      targetAddress: baalAddress,
    },
    args: [
      {
        type: "multicall",
        actions,
        formActions,
      },
      {
        type: "proposalExpiry",
        search: `${FORM}${EXPIRY}`,
        fallback: 0,
      },
      {
        type: "estimateGas",
        actions,
        formActions,
        bufferPercentage: gasBufferPercentage,
      },
      JSONDetails,
    ],
  };
};
