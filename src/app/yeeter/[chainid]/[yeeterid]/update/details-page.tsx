"use client";

import { useEffect } from "react";
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

export const DetailsPage = () => {
  const { chainid, yeeterid } = useParams<{
    chainid: string;
    yeeterid: string;
  }>();
  const { yeeter, metadata } = useYeeter({
    chainid,
    yeeterid,
  });
  const { dao } = useDao({
    chainid,
    daoid: yeeter?.dao.id,
  });
  const queryClient = useQueryClient();
  const { isConnected, address } = useAccount();

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

  if (!yeeter || !dao) return;

  return (
    <div className="w-full">
      <div className="text-muted font-display text-3xl uppercase text-center">
        Update Details
      </div>

      <div className="w-full mt-5">
        <div className="flex flex-col gap-2 mx-4 mb-10">
          <DetailsForm
            confirmed={isConfirmed}
            loading={isSendTxPending || isConfirming}
            invalidConnection={!isConnected}
            handleSubmit={handleSubmit}
            formElmClass="w-full space-y-4"
            hash={hash}
            isError={isError}
            currentProfile={metadata}
          />
        </div>
      </div>
    </div>
  );
};
