import { useEffect, useRef } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useYeeter } from "@/hooks/useYeeter";
import * as Drawer from "../ui/drawer";
import { ArbitraryState, ValidNetwork } from "@/lib/tx-prepper/prepper-types";
import { useDao } from "@/hooks/useDao";
import { TX } from "@/lib/tx-prepper/tx";
import { prepareTX } from "@/lib/tx-prepper/tx-prepper";
import { DetailsForm } from "../forms/DetailsForm";

export const DetailsTx = ({
  yeeterid,
  chainid,
  daoid,
}: {
  yeeterid: string;
  chainid: string;
  daoid: string;
}) => {
  const { yeeter, metadata } = useYeeter({
    chainid,
    yeeterid,
  });
  const { dao } = useDao({
    chainid,
    daoid,
  });
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { isConnected, address } = useAccount();

  const {
    writeContract,
    data: hash,
    isError,
    isPending: isSendTxPending,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    const reset = async () => {
      queryClient.refetchQueries({
        queryKey: ["list-records", { chainid, daoid }],
      });

      queryClient.refetchQueries({
        queryKey: ["get-yeeter", { chainid, yeeterid }],
      });
    };
    if (isConfirmed) {
      console.log("INVALIDATING/REFETCH");
      reset();
    }
  }, [isConfirmed, queryClient, yeeterid, chainid, daoid]);

  const handleSubmit = async (values: ArbitraryState) => {
    if (!yeeter || !dao || !address) return;

    const tx = TX.UPDATE_YEET_METADATA_SETTINGS;

    const wholeState = {
      formValues: {
        ...values,
        yeeterid,
      },
      senderAddress: address,
      daoId: daoid,
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

  const handleClose = () => {
    console.log("closing");
    resetWrite();
  };

  if (!yeeter) return;

  return (
    <>
      <Drawer.Drawer onClose={handleClose}>
        <Drawer.DrawerTrigger className="outline-none">
          <div className="h-8 px-3 text-xs border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-bold font-mulish uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
            Update Details
          </div>
        </Drawer.DrawerTrigger>
        <Drawer.DrawerClose ref={closeRef} className="hidden" />
        <Drawer.DrawerContent className="bg-card">
          <div className="w-full">
            <Drawer.DrawerHeader className="mx-4">
              <Drawer.DrawerTitle className="font-display text-3xl uppercase text-muted">
                Update
              </Drawer.DrawerTitle>
            </Drawer.DrawerHeader>
            <div className="flex flex-col gap-2 mx-4 mb-2">
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
        </Drawer.DrawerContent>
      </Drawer.Drawer>
    </>
  );
};
