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
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getExplorerUrl } from "@/lib/constants";
import { toHex } from "viem";
import sdk from "@farcaster/frame-sdk";
import { LoadingSpinner } from "@/components/ui/loading";

export const DetailsPage = () => {
  const { chainid, yeeterid } = useParams<{
    chainid: string;
    yeeterid: string;
  }>();

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
        ...values,
        yeeterid,
      },
      senderAddress: address,
      daoId: dao.id,
      yeeterid,
    };

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

  if (!yeeter || !dao) return;

  return (
    <div className="w-full">
      <div className="text-primary font-display text-3xl uppercase text-center">
        {isConfirmed ? "Campaign Details Updated" : "Update Campaign Details"}
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
        </div>
      </div>
    </div>
  );
};
