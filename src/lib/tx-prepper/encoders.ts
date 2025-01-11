import { ethers } from "ethers";
import { MetaTransaction } from "ethers-multisend";
import {
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
} from "viem";
import { LOCAL_ABI } from "./abi/abis";
import { ABI, ArgType } from "./prepper-types";

const encodeMetaTransaction = (tx: MetaTransaction): string => {
  const data = ethers.getBytes(tx.data);
  const encoded = ethers.solidityPacked(
    ["uint8", "address", "uint256", "uint256", "bytes"],
    [tx.operation, tx.to, tx.value, data.length, data]
  );
  return encoded.slice(2);
};

export const encodeMultiSend = (txs: MetaTransaction[]): string => {
  return "0x" + txs.map((tx) => encodeMetaTransaction(tx)).join("");
};

export const encodeMultiAction = (rawMulti: MetaTransaction[]) => {
  return encodeFunction(LOCAL_ABI.GNOSIS_MULTISEND, "multiSend", [
    encodeMultiSend(rawMulti),
  ]);
};

export const encodeFunction = (
  abi: ABI,
  fnName: string,
  functionArgs: ReadonlyArray<unknown>
): string | { error: true; message: string } => {
  try {
    if (!abi || !Array.isArray(functionArgs))
      throw new Error(
        "Incorrect params passed to safeEncodeHexFunction in abi.js"
      );

    return encodeFunctionData({
      abi,
      functionName: fnName,
      args: functionArgs,
    });
  } catch (error) {
    console.error("error", error);
    return {
      error: true,
      message: "Could not encode transaction data with the values provided",
    };
  }
};

export const encodeValues = (
  typesArray: string[],
  valueArray: ArgType[]
): string => {
  return encodeAbiParameters(
    parseAbiParameters(typesArray.join(",")),
    valueArray
  );
};

export const txActionToMetaTx = ({
  abi,
  method,
  address,
  args,
  value = 0,
  operation = 0,
}: {
  abi: ABI;
  address: string;
  method: string;
  args: ReadonlyArray<ArgType>;
  value?: number;
  operation?: number;
}): MetaTransaction => {
  const encodedData = encodeFunction(abi, method, args);

  if (typeof encodedData !== "string") {
    throw new Error(encodedData.message);
  }

  console.log("operation", operation);
  return {
    to: address,
    data: encodedData,
    value: value.toString(),
    operation,
  };
};

export const encodeExecFromModule = ({
  safeId,
  metaTx, // usually a multiSend encoded action. See `encodeMultiAction`
}: {
  safeId: string;
  metaTx: MetaTransaction;
}) => {
  return [
    {
      to: safeId,
      data: encodeFunction(
        LOCAL_ABI.GNOSIS_MODULE,
        "execTransactionFromModule",
        [metaTx.to, metaTx.value, metaTx.data, metaTx.operation]
      ),
      value: "0",
      operation: 0,
    } as MetaTransaction,
  ];
};
