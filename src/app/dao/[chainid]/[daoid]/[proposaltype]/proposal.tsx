"use client";

import sdk from "@farcaster/frame-sdk";
import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useConnect,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { FormSwitcher } from "@/components/app/FormSwitcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { getExplorerUrl, getWagmiChainObj } from "@/lib/constants";
import { FORM_CONFIGS, FormConfig, validFormId } from "@/lib/form-configs";
import { proposalCastUrl, truncateError } from "@/lib/formatters";
import { ArbitraryState, ValidNetwork } from "@/lib/tx-prepper/prepper-types";
import { prepareTX } from "@/lib/tx-prepper/tx-prepper";
import { WaitForReceipt } from "@/lib/types";
import { useDaoRecord } from "@/providers/DaoRecordProvider";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import { useParams } from "next/navigation";
import { fromHex } from "viem";

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

  const handleSend = async (values: ArbitraryState) => {
    if (!formConfig) return;

    const wholeState = {
      formValues: {
        ...values,
      },
      senderAddress: address,
      // TODO: is safeID and chainID needed at both levels?
      // chainId: daochain,
      // safeId: daosafe,
      daoId: daoid,
      localABIs: {},
    };

    let tx = formConfig.tx;
    if (formConfig.txToggle && values.txKey) {
      tx = formConfig.txToggle[values.txKey];
    }

    const txPrep = await prepareTX({
      tx,
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
    return (
      <div className="text-destructive text-xs mt-1">
        Error: {truncateError(error.message)}
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!formConfig) return null;

  const validChain = chainId === daochainid;

  return (
    <>
      <div className="w-full h-full space-y-4 pb-4 px-4">
        <Card className="flex flex-col items-center px-4 pt-4 pb-8 rounded-none">
          <div className="text-muted font-display text-3xl uppercase mb-4">
            {formConfig.title}
          </div>

          <FormSwitcher
            formConfig={formConfig}
            confirmed={isConfirmed}
            loading={isSendTxPending || isConfirming}
            invalidConnection={!isConnected || !validChain}
            handleSubmit={handleSend}
            formElmClass="w-full space-y-4"
          />

          <div className="flex flex-col gap-2 w-full space-y-4 pb-4 px-4 mt-3">
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

            {propid && (
              <Button onClick={openProposalCastUrl}>Cast Proposal</Button>
            )}

            {hash && <Button onClick={openUrl}>View on Block Explorer</Button>}
          </div>
        </Card>
      </div>
    </>
  );
}
