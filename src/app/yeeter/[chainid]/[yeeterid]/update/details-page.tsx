"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useYeeter } from "@/hooks/useYeeter";
import { ArbitraryState, ValidNetwork } from "@/lib/tx-prepper/prepper-types";
import { useDao } from "@/hooks/useDao";
import { TX } from "@/lib/tx-prepper/tx";
import { prepareTX } from "@/lib/tx-prepper/tx-prepper";
import { DetailsForm } from "@/components/forms/DetailsForm";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getExplorerUrl } from "@/lib/constants";
import { toHex } from "viem";
import sdk from "@farcaster/frame-sdk";
import { LoadingSpinner } from "@/components/ui/loading";
import { RewardsForm } from "@/components/forms/RewardsForm";

export const DetailsPage = () => {
  const { chainid, yeeterid } = useParams<{
    chainid: string;
    yeeterid: string;
  }>();
  const searchParams = useSearchParams();

  const rewards = searchParams.get("rewards");
  const isRewards = !!rewards;

  const { isConnected, address, chainId } = useAccount();
  const { yeeter, metadata } = useYeeter({
    chainid,
    yeeterid,
  });
  const { dao } = useDao({
    chainid,
    daoid: yeeter?.dao.id,
  });
  const queryClient = useQueryClient();

  const {
    writeContract,
    data: hash,
    isError,
    isPending: isSendTxPending,
    // reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [isCasting, setIsCasting] = useState(false);

  useEffect(() => {
    const reset = async () => {
      queryClient.refetchQueries({
        queryKey: ["list-records", { chainid, daoid: dao?.id }],
      });

      queryClient.refetchQueries({
        queryKey: ["get-yeeter", { chainid, yeeterid }],
      });
    };
    if (isConfirmed) {
      console.log("INVALIDATING/REFETCH");
      reset();
    }
  }, [isConfirmed, queryClient, yeeterid, chainid, dao]);

  const handleSubmit = async (values: ArbitraryState) => {
    if (!yeeter || !dao || !address) return;

    const tx = TX.UPDATE_YEET_METADATA_SETTINGS;

    const wholeState = {
      formValues: {
        discord: metadata?.parsedLinks?.[0].url || "",
        github: metadata?.parsedLinks?.[1].url || "",
        blog: metadata?.parsedLinks?.[2].url || "",
        telegram: metadata?.parsedLinks?.[3].url || "",
        twitter: metadata?.parsedLinks?.[4].url || "",
        web: metadata?.parsedLinks?.[5].url || "",
        custom1: metadata?.parsedLinks?.[6].url || "",
        custom1Label: metadata?.parsedLinks?.[6].label || "",
        custom2: metadata?.parsedLinks?.[7].url || "",
        custom2Label: metadata?.parsedLinks?.[7].label || "",
        custom3: metadata?.parsedLinks?.[8].url || "",
        custom3Label: metadata?.parsedLinks?.[8].label || "",
        rewardLevel1: metadata?.parsedRewards?.[0].rewardLevel || "",
        rewardLevel1Details: metadata?.parsedRewards?.[0].details || "",
        rewardLevel2: metadata?.parsedRewards?.[1].rewardLevel || "",
        rewardLevel2Details: metadata?.parsedRewards?.[1].details || "",
        ...metadata,
        ...values,
        yeeterid,
      },
      senderAddress: address,
      daoId: dao.id,
      yeeterid,
    };

    console.log("wholeState", wholeState);

    const txPrep = await prepareTX({
      tx,
      chainId: chainid as ValidNetwork,
      safeId: dao.safeAddress,
      appState: wholeState,
      argCallbackRecord: {},
      localABIs: {},
    });

    console.log("txPrep", txPrep);
    if (!txPrep) return;

    writeContract(txPrep);
  };

  const handleCastCampaign = useCallback(async () => {
    try {
      setIsCasting(true);
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_URL || "https://fundraiser.farcastle.net";
      const campaignUrl = `${baseUrl}/yeeter/${chainid}/${yeeterid}`;

      await sdk.actions.composeCast({
        text: metadata?.missionStatement || "",
        embeds: [campaignUrl],
      });
    } catch (error) {
      console.error("Error composing cast:", error);
    } finally {
      setIsCasting(false);
    }
  }, [yeeterid, chainid, metadata?.missionStatement]);

  const invalidConnection = !isConnected || chainid !== toHex(chainId || "0");
  const title = isRewards ? "Reward Details" : "Campaign Details";

  if (!yeeter || !dao) return;

  return (
    <div className="w-full">
      <div className="text-primary font-display text-3xl uppercase text-center">
        {isConfirmed ? `${title} Updated` : `Update ${title}`}
      </div>

      <div className="w-full mt-5">
        <div className="flex flex-col gap-2 mx-4 mb-4">
          {isConfirmed ? (
            <div className="flex flex-col items-center gap-8">
              <Image src="/heart.svg" alt="Success" width={300} height={254} />
              <div className="flex flex-col w-full items-center gap-2">
                <Button
                  variant="default"
                  className="w-full mb-2"
                  onClick={handleCastCampaign}
                  disabled={isCasting}
                >
                  {isCasting ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    "Share Campaign"
                  )}
                </Button>
                <Link
                  href={`/yeeter/${chainid}/${yeeterid}`}
                  className="w-full"
                >
                  <Button variant="secondary" className="w-full mb-2">
                    View Campaign
                  </Button>
                </Link>
                {hash && (
                  <Button
                    variant="tertiary"
                    onClick={() =>
                      sdk.actions.openUrl(
                        `${getExplorerUrl(chainid)}/tx/${hash}`
                      )
                    }
                    className="w-full mb-2"
                  >
                    View Transaction
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {isRewards ? (
                <RewardsForm
                  confirmed={isConfirmed}
                  loading={isSendTxPending || isConfirming}
                  invalidConnection={invalidConnection}
                  handleSubmit={handleSubmit}
                  formElmClass="w-full space-y-4"
                  hash={hash}
                  isError={isError}
                  currentProfile={metadata}
                />
              ) : (
                <DetailsForm
                  confirmed={isConfirmed}
                  loading={isSendTxPending || isConfirming}
                  invalidConnection={invalidConnection}
                  handleSubmit={handleSubmit}
                  formElmClass="w-full space-y-4"
                  hash={hash}
                  isError={isError}
                  currentProfile={metadata}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
