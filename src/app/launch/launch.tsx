"use client";

import { Card } from "@/components/ui/card";
import sdk from "@farcaster/frame-sdk";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import { useCallback, useEffect } from "react";
import {
  useAccount,
  useChainId,
  useConnect,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  DEFAULT_SUMMON_VALUES,
  DEFAULT_YEETER_VALUES,
  getExplorerUrl,
  YEETER_CONTRACTS,
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

export default function Launch() {
  const { isLoaded, connector } = useFrameSDK();
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

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

  const openUrl = useCallback(() => {
    sdk.actions.openUrl(`${getExplorerUrl(toHex(chainId))}/tx/${hash}`);
  }, [hash, chainId]);

  const handleSend = async (values: ArbitraryState) => {
    const now = nowInSeconds();

    console.log("values", values);

    const args = {
      chainId: toHex(chainId),
      formValues: {
        daoName: values.name,
        description: values.description,
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

  return (
    <>
      <div className="w-full h-full space-y-4 pb-4 px-4">
        <Card className="flex flex-col items-center px-4 pt-4 pb-8 rounded-none">
          <div className="text-muted font-display text-3xl uppercase mb-4">
            Launch
          </div>

          {!isConfirmed && (
            <LaunchForm
              confirmed={isConfirmed}
              loading={isSendTxPending || isConfirming}
              invalidConnection={!isConnected}
              handleSubmit={handleSend}
              formElmClass="w-full space-y-4"
            />
          )}

          <div className="flex flex-col gap-2 w-full">
            {isSendTxError && renderError(sendTxError)}

            {!isConnected && (
              <Button
                onClick={() => connect({ connector: connector })}
                className="mt-2"
              >
                Connect
              </Button>
            )}

            {isConfirmed && (
              <div className="flex flex-col items-center gap-8">
                <Image
                  src="/heart.svg"
                  alt="Success"
                  width={300}
                  height={254}
                />
                <div className="flex flex-col w-full items-center gap-2">
                  {hash && (
                    <Button onClick={openUrl} className="w-full">
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
