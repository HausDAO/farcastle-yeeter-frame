import { JSXElementConstructor } from "react";
import { BlockTag, TransactionReceipt } from "viem";
import { ValidateField } from "./validation";

// By definition this needs to use any.
// But we should be dilligent about using this type and make sure that
// in cases where we're using this to handle highly level functionality
// we can extends with more specific types (ex. TXBuilder)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ArbitraryState = Record<string, any>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
export type ValueOf<T> = T[keyof T];

export type ArgType = string | number | boolean | bigint | ArgType[];
export type JsonFragmentType = {
  readonly name?: string;
  readonly indexed?: boolean;
  readonly type?: string;
  readonly internalType?: string;
  readonly components?: ReadonlyArray<JsonFragmentType>;
};

export type JsonFragment = {
  readonly name?: string;
  readonly type?: string;

  readonly anonymous?: boolean;

  readonly payable?: boolean;
  readonly constant?: boolean;
  readonly stateMutability?: string;

  readonly inputs?: ReadonlyArray<JsonFragmentType>;
  readonly outputs?: ReadonlyArray<JsonFragmentType>;

  readonly gas?: string;
};
export type ABI = (JsonFragment | JsonFragmentType)[];

// Exported Types

export type Bytes = ArrayLike<number>;

export type BytesLike = Bytes | string;

export type BigIntish = Bytes | bigint | string | number;

export type EthAddress = `0x${string}`;

export const VALID_NETWORKS = {
  "0x1": true,
  "0x64": true,
  "0xa": true,
  "0x89": true,
  "0xa4b1": true,
  "0xaa36a7": true,
  "0x2105": true,
};
export type ValidNetwork = keyof typeof VALID_NETWORKS;
export type Keychain<T = string> = { [key in ValidNetwork]?: T };

export type LookupType = Record<
  string,
  // React wants me to use JSXElementConstructor<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyof JSX.IntrinsicElements | JSXElementConstructor<any>
>;

export type FieldValidationType = keyof typeof ValidateField;

export type FieldLegoBase<Lookup extends LookupType> = {
  [FieldType in keyof Lookup]: React.ComponentProps<Lookup[FieldType]> & {
    type: FieldType;
    expectType?: FieldValidationType;
  };
}[keyof Lookup];

export type FormLegoBase<Lookup extends LookupType = LookupType> = {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  tx?: TXLego;
  fields: FieldLegoBase<Lookup>[];
  requiredFields?: Record<string, boolean>;
  log?: boolean;
  devtool?: boolean;
  submitButtonText?: string;
};

export type RequiredFields = Record<string, boolean>;

export type StringSearch = `.${string}`;

type DetailsSchema = Record<string, ValidArgType>;
export type JSONDetailsSearch = {
  type: "JSONDetails";
  jsonSchema: DetailsSchema;
};
export type MulticallAction = {
  contract: ContractLego;
  method: string;
  value?: ValidArgType;
  operations?: ValidArgType;
  args: ValidArgType[];
  data?: StaticArg | StringSearch;
};
export type MulticallArg = {
  type: "multicall";
  actions: MulticallAction[];
  formActions?: boolean;
};
export type EncodeMulticall = {
  type: "encodeMulticall";
  actions: MulticallAction[];
  formActions?: boolean;
};
export type EncodeCallArg = {
  type: "encodeCall";
  action: MulticallAction;
};
export type EstimateGas = {
  type: "estimateGas";
  actions: MulticallAction[];
  bufferPercentage?: number;
  formActions?: boolean;
};

type ProposalExpiry = {
  type: "proposalExpiry";
  search?: StringSearch;
  fallback: number;
};

type StaticArg = {
  type: "static";
  value: ArgType;
};

type TemplateArg = {
  type: "template";
  value: string;
};

type SingletonSearch = {
  type: "singleton";
  keychain: Keychain;
};

export type ArgEncode = {
  type: "argEncode";
  args: ValidArgType[];
  solidityTypes: string[];
};

export type NestedArray = {
  type: "nestedArray";
  args: ValidArgType[];
};

// export type IPFSPinata = {
//   type: "ipfsPinata";
//   content: ValidArgType;
// };

export type ValidArgType =
  | StringSearch
  | JSONDetailsSearch
  | EstimateGas
  | SingletonSearch
  | NestedArray
  | MulticallArg
  | EncodeCallArg
  | ProposalExpiry
  | StaticArg
  | TemplateArg
  // | IPFSPinata
  | EncodeMulticall
  | ArgEncode;

export type TxStates =
  | "idle"
  | "submitting"
  | "polling"
  | "pollFailed"
  | "failed"
  | "success";

export type TXOverrides = {
  gasLimit?: ValidArgType;
  value?: ValidArgType;
  gasPrice?: ValidArgType;
  from?: ValidArgType;
  blockTag?: ValidArgType;
};

export type TXStaticOverrides = {
  gasLimit?: bigint;
  value?: bigint;
  gasPrice?: bigint;
  from?: `0x${string}`;
  blockTag?: BlockTag;
};

export type TXLegoBase = {
  id: string;
  contract: ContractLego;
  method: string;
  args?: ValidArgType[];
  argCallback?: string;
  staticArgs?: ArgType[];
  overrides?: TXOverrides;
  staticOverrides?: TXStaticOverrides;
  disablePoll?: boolean;
  customPoll?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetch: (...args: any) => Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    test: (result?: any) => boolean;
  };
};

export type TXLego = RequireOnlyOne<
  TXLegoBase,
  "args" | "argCallback" | "staticArgs"
>;

export type StaticContract = {
  contractName: string;
  type: "static";
  abi: ABI;
  targetAddress: Keychain | StringSearch | EthAddress;
};
export type LocalContract = {
  contractName: string;
  type: "local";
  targetAddress: Keychain | StringSearch | EthAddress;
};
export type RemoteContract = {
  contractName: string;
  type: "remote";
  targetAddress: Keychain | StringSearch | EthAddress;
};
export type ProcessedContract = {
  type: "processed";
  contractName: string;
  abi: ABI;
  address: string;
};
export type ContractLego =
  | StaticContract
  | RemoteContract
  | LocalContract
  | ProcessedContract;

export enum ProposalTypeIds {
  Signal = "SIGNAL",
  IssueSharesLoot = "ISSUE",
  AddShaman = "ADD_SHAMAN",
  TransferErc20 = "TRANSFER_ERC20",
  TransferNetworkToken = "TRANSFER_NETWORK_TOKEN",
  UpdateGovSettings = "UPDATE_GOV_SETTINGS",
  UpdateTokenSettings = "TOKEN_SETTINGS",
  TokensForShares = "TOKENS_FOR_SHARES",
  GuildKick = "GUILDKICK",
  WalletConnect = "WALLETCONNECT",
  Multicall = "MULTICALL",
  AddSigner = "ADD_SIGNER",
}

export type FireTransaction<
  CallerStateModel extends ArbitraryState = ArbitraryState
> = ({
  tx,
  callerState,
  lifeCycleFns,
  staticArgs,
}: {
  tx: TXLego;
  callerState?: CallerStateModel;
  lifeCycleFns?: TXLifeCycleFns;
  staticArgs?: ArgType[];
}) => Promise<boolean> | undefined;

export type TXLifeCycleFns = {
  onRequestSign?: () => void;
  onTxHash?: (txHash: string) => void;
  onTxError?: (error: unknown) => void;
  onTxSuccess?: (
    txReceipt: TransactionReceipt,
    txHash: string,
    appState: ArbitraryState
  ) => void;
  onPollStart?: () => void;
  onPollError?: (error: unknown) => void;
  onPollSuccess?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any,
    txReceipt: TransactionReceipt,
    appState: ArbitraryState
  ) => void;
};

export type ArgCallback = (
  state: ArbitraryState
) => ArgType[] | Promise<ArgType[]>;
