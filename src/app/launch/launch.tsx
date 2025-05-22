"use client";

import { Card } from "@/components/ui/card";
import sdk from "@farcaster/frame-sdk";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useChains,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  DEFAULT_SUMMON_VALUES,
  DEFAULT_YEETER_VALUES,
  getExplorerUrl,
  YEETER_CONTRACTS,
  getWagmiChainObj,
} from "@/lib/constants";
import { toHex } from "viem";
import { nowInSeconds } from "@/lib/helpers";
import { toBaseUnits } from "@/lib/units";
import { assembleYeeterSummonerArgs } from "@/lib/summon-tx";
import yeeterSummonerAbi from "../../lib/tx-prepper/abi/yeeterSummoner.json";
import { ArbitraryState } from "@/lib/tx-prepper/prepper-types";
import { truncateError } from "@/lib/formatters";
import { LoadingSpinner } from "@/components/ui/loading";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LaunchForm } from "@/components/forms/LaunchForm";
import Link from "next/link";
import { useYeeterByTx } from "@/hooks/useYeeterTx";
import { triggerLaunchWorkflow } from "@/lib/notifications/qstash";

type ChainName = "OP Mainnet" | "Base" | "Gnosis" | "Arbitrum One" | "Sepolia";

const chainNames: Record<ChainName, string> = {
  // Ethereum: "Ethereal",
  "OP Mainnet": "Optimistic",
  Base: "Based",
  Gnosis: "Gnostic",
  "Arbitrum One": "Arbitral",
  // Polygon: "Polymorphic",
  Sepolia: "Sepolic",
};

export default function Launch() {
  const { isLoaded, context } = useFrameSDK();
  const { address, isConnected, chainId } = useAccount();
  const chains = useChains();
  const [campaignName, setCampaignName] = useState();

  const {
    writeContract,
    data: hash,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash,
    });

  const {
    yeeter,
    isError: isYeeterError,
    isLoading: isYeeterLoading,
  } = useYeeterByTx({
    chainid: chainId ? toHex(chainId) : undefined,
    txHash: hash,
  });

  useEffect(() => {
    if (yeeter && chainId) {
      console.log("^^^^^^^^^^^^^^^^^^^^^ notify", yeeter);

      triggerLaunchWorkflow({
        yeeterid: yeeter.id,
        chainid: toHex(chainId),
        campaignName,
        username: context?.user.displayName,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yeeter, chainId]);

  const openUrl = useCallback(() => {
    if (chainId) {
      sdk.actions.openUrl(`${getExplorerUrl(toHex(chainId))}/tx/${hash}`);
    }
  }, [hash, chainId]);

  const handleSend = async (values: ArbitraryState) => {
    if (!chainId) return;
    const now = nowInSeconds();

    console.log("values", values);
    setCampaignName(values.name);

    const args = {
      chainId: toHex(chainId),
      formValues: {
        daoName: values.name,
        lootTokenSymbol: values.lootTokenSymbol,
        members: [address],
        startTime: now.toFixed(0),
        endTime: (now + Number(values.duration)).toFixed(0),
        goal: toBaseUnits(values.goal),
        minTribute: DEFAULT_YEETER_VALUES.minTribute,
        multiplier: DEFAULT_YEETER_VALUES.multiplier,
        votingPeriodInSeconds: DEFAULT_SUMMON_VALUES.votingPeriodInSeconds,
        gracePeriodInSeconds: DEFAULT_SUMMON_VALUES.gracePeriodInSeconds,
        newOffering: DEFAULT_SUMMON_VALUES.newOffering,
        quorum: DEFAULT_SUMMON_VALUES.quorum,
        sponsorThreshold: DEFAULT_SUMMON_VALUES.sponsorThreshold,
        minRetention: DEFAULT_SUMMON_VALUES.minRetention,
      },
    };
    console.log("args", args);

    const summonArgs = assembleYeeterSummonerArgs(args);

    console.log("summonArgs", summonArgs);

    writeContract({
      address: YEETER_CONTRACTS["ONBOARDER_SUMMONER"][
        toHex(chainId)
      ] as `0x${string}`,
      abi: yeeterSummonerAbi,
      functionName: "summonBaalFromReferrer",
      args: summonArgs,
    });
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

  const connectedToValidChain = chains.find(
    (chain) => chain.id === chainId
  )?.id;
  const invalidConnection = !isConnected || connectedToValidChain === undefined;

  const yeeterIdOrError = isYeeterError || Boolean(yeeter?.id);
  const showConfirmed = Boolean(isConfirmed && yeeterIdOrError);

  return (
    <>
      <div className="w-full h-full space-y-4 pb-4 px-4">
        <Card className="flex flex-col items-center px-4 pt-4 pb-8 rounded-none">
          {!chainId && (
            <div className="text-primary font-display text-3xl uppercase mb-4">
              Campaign
            </div>
          )}
          {chainId && (
            <div className="text-primary font-display text-3xl uppercase mb-4">
              {showConfirmed
                ? `${chainNames[getWagmiChainObj(toHex(chainId)).name as ChainName] || "Base"} Campaign Launched`
                : `${chainNames[getWagmiChainObj(toHex(chainId)).name as ChainName] || "Base"} Campaign`}
            </div>
          )}

          {!showConfirmed && (
            <LaunchForm
              confirmed={showConfirmed}
              loading={isSendTxPending || isConfirming || isYeeterLoading}
              invalidConnection={invalidConnection}
              handleSubmit={handleSend}
              formElmClass="w-full space-y-4"
            />
          )}

          <div className="flex flex-col gap-2 w-full">
            {isSendTxError && renderError(sendTxError)}

            {showConfirmed && (
              <div className="flex flex-col items-center gap-8">
                <Image
                  src="/heart.svg"
                  alt="Success"
                  width={300}
                  height={254}
                />

                <div className="flex flex-col w-full items-center gap-2">
                  <Link
                    href={
                      !isYeeterError && chainId && yeeter?.id
                        ? `/yeeter/${toHex(chainId)}/${yeeter.id}`
                        : "/explore"
                    }
                    className="w-full"
                  >
                    <Button className="w-full mb-2">
                      Edit Campaign Details
                    </Button>
                  </Link>

                  {hash && (
                    <Button
                      variant="secondary"
                      onClick={openUrl}
                      className="w-full"
                    >
                      View Transaction
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
