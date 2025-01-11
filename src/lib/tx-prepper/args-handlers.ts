import { encodeMulti, MetaTransaction } from "ethers-multisend";
import { processContractLego } from "./contracts";
import {
  encodeExecFromModule,
  encodeFunction,
  encodeMultiAction,
  encodeValues,
  txActionToMetaTx,
} from "./encoders";
import {
  ABI,
  ArbitraryState,
  ArgCallback,
  ArgEncode,
  ArgType,
  EncodeCallArg,
  EncodeMulticall,
  EstimateGas,
  JSONDetailsSearch,
  Keychain,
  MulticallArg,
  StringSearch,
  TXLego,
  ValidArgType,
  ValidNetwork,
} from "./prepper-types";
import { checkArgType, isSearchArg } from "./typeguards";
import { CONTRACT_KEYCHAINS } from "./contract-keychains";
import { GAS_BUFFER_MULTIPLIER, gasEstimateFromActions } from "./gas-estimate";

export const searchArg = ({
  appState,
  searchString,
  shouldThrow = false,
}: {
  appState: ArbitraryState;
  searchString: StringSearch;
  shouldThrow: boolean;
}) => {
  const hasCondition = checkHasCondition(searchString);

  if (hasCondition) {
    const paths = handleConditionalPath(searchString);
    for (const path of paths) {
      const result = searchApp(appState, path as StringSearch);
      if (result) {
        return checkArgType(result);
      }
    }
    throw new Error(
      `No paths in conditional path string: ${searchString} returns a value`
    );
  }
  return checkArgType(searchApp(appState, searchString, shouldThrow));
};

export const processArgs = async ({
  tx,
  chainId,
  safeId,
  localABIs,
  appState,
  argCallbackRecord,
}: {
  tx: TXLego;
  chainId: ValidNetwork;
  safeId?: string;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
  argCallbackRecord: Record<string, ArgCallback>;
}) => {
  const { argCallback, args, staticArgs } = tx;

  if (staticArgs) {
    return staticArgs;
  }
  if (argCallback) {
    return handleArgCallback({
      tx,
      chainId,
      safeId,
      localABIs,
      appState,
      argCallbackRecord,
    });
  }

  if (args) {
    return await Promise.all(
      args?.map(
        async (arg) =>
          await processArg({
            arg,
            chainId,
            safeId,
            localABIs,
            appState,
          })
      )
    );
  }
  throw new Error(
    "TX Lego must have a valid arg type, use either a string alias for an argument callback or an array of valid arguments"
  );
};

export const processArg = async ({
  arg,
  chainId,
  safeId,
  localABIs,
  appState,
}: {
  arg: ValidArgType;
  chainId: ValidNetwork;
  safeId?: string;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
}): Promise<ArgType> => {
  if (isSearchArg(arg)) {
    return searchArg({ appState, searchString: arg, shouldThrow: true });
  }
  if (arg?.type === "static") {
    return arg.value;
  }
  if (arg?.type === "template") {
    // appState variables should be enclosed in curly braces e.g. `Send {.formValues.value} ETH`
    const fragments = arg.value.split(/{|}/g);
    return fragments
      .map((f: string) =>
        f[0] === "."
          ? searchArg({
              appState,
              searchString: f as StringSearch,
              shouldThrow: true,
            })
          : f
      )
      .join("");
  }
  if (arg?.type === "singleton") {
    return handleKeychainArg({ chainId, keychain: arg.keychain });
  }
  if (arg?.type === "nestedArray") {
    return Promise.all(
      arg.args.map(
        async (arg) =>
          await processArg({
            arg,
            chainId,
            safeId,
            localABIs,
            appState,
          })
      )
    );
  }
  if (arg?.type === "multicall" || arg.type === "encodeMulticall") {
    const actions = await handleMulticallArg({
      arg,
      chainId,
      localABIs,
      appState,
    });
    const result = await handleEncodeMulticallArg({
      arg,
      actions,
    });

    return result;
  }
  if (arg?.type === "encodeCall") {
    const result = await handleEncodeCallArg({
      arg,
      chainId,
      localABIs,
      appState,
    });
    return result;
  }
  if (arg?.type === "argEncode") {
    const result = await handleArgEncode({
      arg,
      chainId,
      localABIs,
      appState,
    });
    return result;
  }
  if (arg?.type === "estimateGas") {
    const result = await handleGasEstimate({
      arg,
      chainId,
      safeId,
      localABIs,
      appState,
    });
    return result;
  }
  if (arg?.type === "proposalExpiry") {
    // TODO: Implement proposal expiration arg
    return "0";
  }
  if (arg?.type === "JSONDetails") {
    const result = await handleDetailsJSON({
      arg,
      chainId,
      safeId,
      localABIs,
      appState,
    });
    return result;
  }
  console.log("**DEBUG**");
  console.log("arg", arg);
  throw new Error(`ArgType not found.`);
};

export const checkHasCondition = (pathString: StringSearch) =>
  pathString.includes("||");
export const handleConditionalPath = (pathString: StringSearch) => {
  const paths = pathString
    .trim()
    .split("||")
    .map((str) => str.trim())
    .filter(Boolean);

  return paths;
};

export const searchApp = (
  appState: ArbitraryState,
  pathString: StringSearch,
  shouldThrow = false
) => {
  const result = deepSearch(appState, pathString);

  if (result == null) {
    if (shouldThrow) {
      console.log("**Application State**", appState);
      console.log("result", result);
      throw new Error(`Could not find ${pathString}`);
    } else {
      return false;
    }
  }
  return result;
};

const handleKeychainArg = ({
  chainId,
  keychain,
}: {
  chainId: ValidNetwork;
  keychain: Keychain;
}) => {
  if (!keychain[chainId]) {
    throw new Error(`Could not find keychain for chainId: ${chainId}`);
  }
  return keychain[chainId] as string;
};

const handleArgCallback = async ({
  tx,
  chainId,
  safeId,
  localABIs,
  appState,
  argCallbackRecord,
}: {
  tx: TXLego;
  chainId: ValidNetwork;
  safeId?: string;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
  argCallbackRecord: Record<string, ArgCallback>;
}) => {
  const callbackKey = tx.argCallback;

  if (callbackKey && argCallbackRecord[callbackKey]) {
    const callback = argCallbackRecord[callbackKey];
    const result = await callback({ tx, chainId, safeId, localABIs, appState });
    return result;
  }
  throw new Error(`Could not find argCallback: ${callbackKey}`);
};

export const handleMulticallArg = async ({
  arg,
  chainId,
  localABIs,
  appState,
}: {
  arg: MulticallArg | EncodeMulticall;
  chainId: ValidNetwork;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
}) => {
  const encodedActions = await Promise.all(
    arg.actions.map(async (action) => {
      const { contract, method, args, value, operations, data } = action;
      const processedContract = await processContractLego({
        contract,
        chainId,
        localABIs,
        appState,
      });

      const processValue = value
        ? await processArg({
            arg: value,
            chainId,
            localABIs,
            appState,
          })
        : 0;

      const processedOperations = operations
        ? await processArg({
            arg: operations,
            chainId,
            localABIs,
            appState,
          })
        : 0;

      // Early return if encoded data is passed and args do not need processing
      if (data) {
        return {
          to: processedContract.address,
          data: (await processArg({
            arg: data,
            chainId,
            localABIs,
            appState,
          })) as string,
          value: processValue.toString(),
          operation: Number(processedOperations),
        };
      }

      const processedArgs = await Promise.all(
        args.map(
          async (arg) =>
            await processArg({
              arg,
              chainId,
              localABIs,
              appState,
            })
        )
      );

      return txActionToMetaTx({
        abi: processedContract.abi,
        method,
        address: processedContract.address,
        args: processedArgs,
        value: Number(processValue),
        operation: Number(processedOperations),
      });
    })
  );
  const encodedFormActions = arg.formActions
    ? handleMulticallFormActions({ appState })
    : [];

  return [...encodedActions, ...encodedFormActions];
};

export const handleEncodeCallArg = async ({
  arg,
  chainId,
  localABIs,
  appState,
}: {
  arg: EncodeCallArg;
  chainId: ValidNetwork;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
}) => {
  const { contract, method, args } = arg.action;
  const processedContract = await processContractLego({
    contract,
    chainId,
    localABIs,
    appState,
  });

  const processedArgs = await Promise.all(
    args.map(
      async (arg) =>
        await processArg({
          arg,
          chainId,
          localABIs,
          appState,
        })
    )
  );

  const encodedData = encodeFunction(
    processedContract.abi,
    method,
    processedArgs
  );

  if (typeof encodedData !== "string") {
    throw new Error(encodedData.message);
  }

  return encodedData;
};

export const handleEncodeMulticallArg = async ({
  arg,
  actions,
}: {
  arg: MulticallArg | EncodeMulticall;
  actions: MetaTransaction[];
}) => {
  if (arg.type === "encodeMulticall") {
    const result = encodeMulti(actions);

    if (typeof result !== "string") {
      throw new Error("Could not encode generic multicall");
    }
    return result;
  }

  const result = encodeMultiAction(actions);

  if (typeof result !== "string") {
    throw new Error(result.message);
  }
  return result;
};

export const handleArgEncode = async ({
  arg,
  chainId,
  localABIs,
  appState,
}: {
  arg: ArgEncode;
  chainId: ValidNetwork;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
}) => {
  const { args, solidityTypes } = arg;
  if (args.length !== solidityTypes.length) {
    throw new Error(`Arguments and types must be the same length`);
  }

  const processedArgs = await Promise.all(
    args.map(
      async (arg) =>
        await processArg({
          arg,
          chainId,
          localABIs,
          appState,
        })
    )
  );
  console.log("processedArgs", processedArgs);

  return encodeValues(solidityTypes, processedArgs);
};

export const handleGasEstimate = async ({
  safeId,
  chainId,
  localABIs = {},
  appState,
  arg,
}: {
  safeId?: string;
  chainId: ValidNetwork;
  arg: EstimateGas;
  appState: ArbitraryState;
  localABIs?: Record<string, ABI>;
}) => {
  if (!safeId) throw new Error("Safe ID is required to estimate gas");

  const actions = await handleMulticallArg({
    localABIs,
    chainId,
    appState,
    arg: {
      type: "multicall",
      actions: arg.actions,
      formActions: arg.formActions,
    },
  });

  const { daoId } = appState;
  // wrap on a multiSend action for simulation
  const metaTx = {
    to: CONTRACT_KEYCHAINS.GNOSIS_MULTISEND[chainId],
    data: encodeMultiAction(actions),
    value: "0",
    operation: 1,
  } as MetaTransaction;
  const gasEstimate = await gasEstimateFromActions({
    actions: encodeExecFromModule({ safeId, metaTx }),
    actionsCount: actions.length,
    chainId,
    daoId,
    safeId,
  });

  if (gasEstimate) {
    // adds buffer to baalgas estimate
    const buffer = arg.bufferPercentage || GAS_BUFFER_MULTIPLIER;
    return Math.round(Number(gasEstimate) * Number(buffer));
  } else {
    // This happens when the safe vault takes longer to be indexed by the Gnosis API
    // and it returns a 404 HTTP error
    console.error(`Failed to estimate gas`);
    return 0;
  }
};

export const handleDetailsJSON = async ({
  arg,
  appState,
  localABIs,
  chainId,
  safeId,
}: {
  arg: JSONDetailsSearch;
  appState: ArbitraryState;
  localABIs: Record<string, ABI>;
  chainId: ValidNetwork;
  safeId?: string;
}) => {
  const detailsList = await Promise.all(
    Object.entries(arg.jsonSchema).map(async ([key, arg]) => {
      return {
        id: key,
        value: await processArg({
          arg,
          chainId,
          safeId,
          localABIs,
          appState,
        }),
      };
    })
  );
  if (!detailsList) {
    console.log("arg", arg);
    throw new Error(`Error Compiling JSON Details`);
  }

  return JSON.stringify(
    detailsList.reduce((acc, arg) => {
      return { ...acc, [arg.id]: arg.value };
    }, {})
  );
};

export const deepSearch = (
  appState: ArbitraryState,
  pathString: StringSearch
): unknown => {
  const path = pathString.trim().split(".").filter(Boolean);
  let state = { ...appState };
  for (let i = 0, len = path.length; i < len; i++) {
    state = state?.[path?.[i]];
  }
  return state;
};

const handleMulticallFormActions = ({
  appState,
}: {
  appState: ArbitraryState;
}): MetaTransaction[] => {
  const validTxs = appState.formValues.tx
    ? Object.keys(appState.formValues.tx).filter((actionId: string) => {
        const action = appState.formValues.tx[actionId];
        return !action.deleted;
      })
    : [];
  if (!validTxs.length) {
    throw new Error("No actions found");
  }
  const sortedTxs = validTxs.sort((actionA: string, actionB: string) =>
    Number(appState.formValues.tx[actionA].index) >
    Number(appState.formValues.tx[actionB].index)
      ? 1
      : -1
  );
  return sortedTxs.map((actionId: string) => {
    const action = appState.formValues.tx[actionId];
    const { to, data, value, operation } = action;
    return {
      to,
      data,
      value,
      operation,
    };
  });
};
