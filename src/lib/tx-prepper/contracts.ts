import { searchArg } from "./args-handlers";
import {
  ABI,
  ArbitraryState,
  ContractLego,
  EthAddress,
  Keychain,
  LocalContract,
  ProcessedContract,
  StaticContract,
  StringSearch,
  ValidNetwork,
} from "./prepper-types";
import { isEthAddress, isSearchArg } from "./typeguards";

export const processContractLego = async ({
  contract,
  chainId,
  localABIs,
  appState,
}: {
  contract: ContractLego;
  chainId: ValidNetwork;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
}) => {
  if (contract.type === "static") {
    return processStaticContract({
      localContract: contract as StaticContract,
      chainId,
      appState,
    });
  }
  if (contract.type === "local") {
    return processLocalContract({
      localContract: contract as LocalContract,
      chainId,
      localABIs,
      appState,
    });
  }

  //  TODO: bring in remote contract precessing
  if (contract.type === "processed") {
    return contract;
  }

  throw new Error("ABI not found. Remote fetching not implemented");
};

const processStaticContract = ({
  localContract,
  chainId,
  appState,
}: {
  localContract: StaticContract;
  chainId: ValidNetwork;
  appState: ArbitraryState;
}): ProcessedContract => {
  const { targetAddress, abi, contractName } = localContract;
  const address = handleTargetAddress({ targetAddress, chainId, appState });
  if (!address) {
    throw new Error(
      `No address found for contract ${contractName} on ${chainId}`
    );
  }
  return {
    type: "processed",
    abi,
    address,
    contractName,
  };
};

const processLocalContract = ({
  localContract,
  chainId,
  localABIs,
  appState,
}: {
  localContract: LocalContract;
  chainId: ValidNetwork;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
}): ProcessedContract => {
  const { targetAddress, contractName } = localContract;
  const abi = localABIs[contractName];
  const address = handleTargetAddress({ targetAddress, chainId, appState });
  if (!address) {
    throw new Error(
      `No address found for contract ${contractName} on ${chainId}`
    );
  }
  return {
    type: "processed",
    abi,
    address,
    contractName,
  };
};

const handleTargetAddress = (args: {
  appState: ArbitraryState;
  targetAddress: StringSearch | Keychain | EthAddress;
  chainId: ValidNetwork;
}): EthAddress => {
  const address = findTargetAddress(args);
  if (isEthAddress(address)) return address;
  throw new Error(`Target address: ${address} is not a valid ethereum address`);
};

const findTargetAddress = ({
  appState,
  targetAddress,
  chainId,
}: {
  appState: ArbitraryState;
  targetAddress: StringSearch | Keychain | EthAddress;
  chainId: ValidNetwork;
}) => {
  if (typeof targetAddress === "string" && isEthAddress(targetAddress)) {
    return targetAddress;
  }
  if (typeof targetAddress === "string" && isSearchArg(targetAddress)) {
    return searchArg({
      searchString: targetAddress,
      appState,
      shouldThrow: true,
    });
  }
  if (
    typeof targetAddress === "object" &&
    typeof targetAddress[chainId] === "string"
  ) {
    return targetAddress[chainId] as string;
  }
  throw new Error(`No address found for targetAddress: ${targetAddress}`);
};
