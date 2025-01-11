import { MetaTransaction } from "ethers-multisend";
import { EthAddress, Keychain, ValidNetwork } from "./prepper-types";
import { Chain, createPublicClient, http } from "viem";
import {
  arbitrum,
  base,
  gnosis,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "viem/chains";

export const GAS_BUFFER_MULTIPLIER = 1.2; // buffers baalgas estimate
export const ACTION_GAS_LIMIT_ADDITION = 150000;

export const gasEstimateFromActions = async ({
  actions,
  actionsCount,
  chainId,
  daoId,
}: {
  actions: MetaTransaction[];
  actionsCount: number;
  chainId: ValidNetwork;
  daoId: string;
  safeId: string; // not used at the moment
}) => {
  const esitmatedGases = await Promise.all(
    actions.map(
      async (action) =>
        await estimateFunctionalGas({
          chainId: chainId,
          contractAddress: action.to,
          from: daoId, // from value needs to be the safe module (baal) to estimate without revert
          value: BigInt(Number(action.value)),
          data: action.data,
        })
    )
  );

  // get sum of all gas estimates
  const totalGasEstimate = esitmatedGases?.reduce(
    (a, b) => (a || 0) + (b || 0),
    0
  );

  // extra gas overhead when calling the dao from the baal safe
  const baalOnlyGas = actionsCount * ACTION_GAS_LIMIT_ADDITION;
  console.log("baalOnlyGas addtition", baalOnlyGas);
  console.log("totalGasEstimate", totalGasEstimate);

  return (totalGasEstimate || 0) + baalOnlyGas;
};

export const estimateFunctionalGas = async ({
  chainId,
  contractAddress,
  from,
  value,
  data,
}: {
  chainId: ValidNetwork;
  contractAddress: string;
  from: string;
  value: bigint;
  data: string;
}): Promise<number | undefined> => {
  const client = createPublicClient({
    chain: VIEM_CHAINS[chainId],
    // TODO: app should pass rpc
    transport: http(),
  });

  const functionGasFees = await client.estimateGas({
    account: from as EthAddress,
    to: contractAddress as EthAddress,
    value,
    data: data as `0x${string}`,
  });

  console.log("functionGasFees", functionGasFees);

  return Number(functionGasFees);
};

export const VIEM_CHAINS: Keychain<Chain> = {
  "0x1": mainnet,
  "0x64": gnosis,
  "0x89": polygon,
  "0xa": optimism,
  "0xa4b1": arbitrum,
  "0xaa36a7": sepolia,
  "0x2105": base,
};
