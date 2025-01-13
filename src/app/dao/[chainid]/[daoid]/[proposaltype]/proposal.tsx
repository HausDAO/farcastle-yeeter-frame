"use client";

import { useEffect, useState, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useConnect,
  useWriteContract,
  useChainId,
  useSwitchChain,
} from "wagmi";

import { fromHex } from "viem";
import { Button } from "@/components/ui/button";
import { prepareTX } from "@/lib/tx-prepper/tx-prepper";
import { getExplorerUrl, getWagmiChainObj } from "@/lib/constants";
import { useParams } from "next/navigation";
import {
  FORM_CONFIGS,
  FormConfig,
  FormValues,
  validFormId,
} from "@/lib/form-configs";
import { ValidNetwork } from "@/lib/tx-prepper/prepper-types";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import { useDaoRecord } from "@/providers/DaoRecordProvider";
import { WaitForReceipt } from "@/lib/types";
import { proposalCastUrl } from "@/lib/formatters";
import { FormSwitcher } from "@/components/app/FormSwitcher";
// import { FormSwitcher } from "@/forms/FormSwitcher";

const getPropidFromReceipt = (receipt: WaitForReceipt): number | null => {
  if (!receipt || !receipt.logs[0].topics[1]) return null;

  return fromHex(receipt.logs[0].topics[1], "number");
};

export default function Proposal() {
  const params = useParams<{ proposaltype: string }>();

  const { isLoaded, connector } = useFrameSDK();
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { daoid, daochain, daosafe, daochainid } = useDaoRecord();

  const [propid, setPropid] = useState<number | null>(null);
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [validValues, setValidValues] = useState<boolean>(false);

  const {
    writeContract,
    data: hash,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useWriteContract();

  const {
    data: receiptData,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: hash,
  });

  useEffect(() => {
    if (params.proposaltype && validFormId(params.proposaltype)) {
      setFormConfig(FORM_CONFIGS[params.proposaltype]);
    }
  }, [params]);

  useEffect(() => {
    if (!receiptData || !receiptData.logs[0].topics[1]) return;
    setPropid(getPropidFromReceipt(receiptData));
  }, [receiptData]);

  const openProposalCastUrl = useCallback(() => {
    if (!daochain || !daoid || !propid) return;
    sdk.actions.openUrl(proposalCastUrl(daochain, daoid, propid));
  }, [propid, daoid, daochain]);

  const openUrl = useCallback(() => {
    sdk.actions.openUrl(`${getExplorerUrl(daochain)}/tx/${hash}`);
  }, [hash, daochain]);

  const handleSend = async () => {
    console.log("formValues", formValues);

    if (!formConfig) return;

    const wholeState = {
      formValues: {
        ...formValues,
        recipient: address,
      },
      chainId: daochain,
      safeId: daosafe,
      daoId: daoid,
      localABIs: {},
    };

    const txPrep = await prepareTX({
      tx: formConfig.tx,
      chainId: daochain as ValidNetwork,
      safeId: daosafe,
      appState: wholeState,
      argCallbackRecord: {},
      localABIs: {},
    });

    console.log("txPrep", txPrep);
    if (!txPrep) return;

    writeContract(txPrep);
  };

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!formConfig) return null;

  const validChain = chainId === daochainid;
  const disableSubmit =
    !isConnected ||
    isSendTxPending ||
    !validChain ||
    isConfirming ||
    !!hash ||
    !validValues;
  const txLoading = isSendTxPending || isConfirming;

  return (
    <>
      <FormSwitcher
        formid={formConfig.id}
        isConfirmed={isConfirmed}
        formValues={formValues}
        validValues={validValues}
        setFormValues={setFormValues}
        setValidValues={setValidValues}
      />

      <div className="flex flex-col gap-2">
        <Button onClick={handleSend} disabled={disableSubmit}>
          {txLoading
            ? "Loading"
            : formConfig.submitButtonText || "Create Proposal"}
        </Button>
        {isSendTxError && renderError(sendTxError)}

        {!isConnected && (
          <>
            <Button onClick={() => connect({ connector: connector })}>
              Connect
            </Button>
          </>
        )}

        {isConnected && !validChain && (
          <Button
            onClick={() =>
              switchChain({ chainId: getWagmiChainObj(daochain).id })
            }
          >
            Switch to {getWagmiChainObj(daochain).name}
          </Button>
        )}

        {propid && <Button onClick={openProposalCastUrl}>Cast Proposal</Button>}

        {hash && <Button onClick={openUrl}>View Tx on Block Explorer</Button>}
      </div>
    </>
  );
}
