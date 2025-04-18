import { useEffect, useRef } from "react";
import { toBaseUnits } from "../../lib/units";
import {
  useAccount,
  useChainId,
  useChains,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import yeeterAbi from "../../lib/tx-prepper/abi/yeeterShaman.json";
import { useYeeter } from "@/hooks/useYeeter";
import * as Drawer from "../ui/drawer";
import { YeetForm } from "../forms/YeetForm";
import { formatLootForMin, formatMinContribution } from "@/lib/yeet-helpers";
import { nativeCurrencySymbol } from "@/lib/helpers";
import { ArbitraryState } from "@/lib/tx-prepper/prepper-types";
import { Button } from "../ui/button";

export const YeetTx = ({
  yeeterid,
  chainid,
}: {
  yeeterid: string;
  chainid: string;
}) => {
  const { yeeter } = useYeeter({
    chainid,
    yeeterid,
  });
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { isConnected } = useAccount();

  const chainId = useChainId();
  const chains = useChains();
  const activeChain = chains.find((c) => c.id === chainId);

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
      queryClient.invalidateQueries({
        queryKey: ["get-yeeter", { chainid, yeeterid }],
      });

      queryClient.invalidateQueries({
        queryKey: ["list-yeets", { yeeterid }],
      });

      queryClient.invalidateQueries({
        queryKey: ["list-yeeters", { chainid }],
      });
    };
    if (isConfirmed) {
      console.log("INVALIDATING/REFETCH");
      reset();
    }
  }, [isConfirmed, queryClient, yeeterid, chainid]);

  const handleSubmit = (values: ArbitraryState) => {
    if (!yeeter) return;

    writeContract({
      address: yeeter.id as `0x${string}`,
      abi: yeeterAbi,
      functionName: "contributeEth",
      value: BigInt(toBaseUnits(values.amount.toString())),
      args: [values.message],
    });
  };

  const handleClose = () => {
    console.log("closing");
    resetWrite();
  };

  if (!yeeter) return;

  return (
    <>
      <Drawer.Drawer onClose={handleClose}>
        <Drawer.DrawerTrigger className="w-full">
          <div className="px-4">
            <Button className="w-full">Contribute to Campaign</Button>
          </div>
        </Drawer.DrawerTrigger>
        <Drawer.DrawerClose ref={closeRef} className="hidden" />
        <Drawer.DrawerContent className="bg-card">
          <div className="w-full">
            <Drawer.DrawerHeader className="mx-4">
              <Drawer.DrawerTitle className="font-display text-3xl uppercase text-muted">
                Contribute
                <div className="text-lg font-bold mt-1">
                  Receive {formatLootForMin(yeeter)} loot tokens per{" "}
                  {formatMinContribution(yeeter)}{" "}
                  {nativeCurrencySymbol(activeChain)} contributed
                </div>
              </Drawer.DrawerTitle>
            </Drawer.DrawerHeader>
            <div className="flex flex-col gap-2 mx-4 mb-10">
              <YeetForm
                confirmed={isConfirmed}
                yeeter={yeeter}
                loading={isSendTxPending || isConfirming}
                invalidConnection={!isConnected}
                handleSubmit={handleSubmit}
                formElmClass="w-full space-y-4"
                hash={hash}
                isError={isError}
              />
            </div>
          </div>
        </Drawer.DrawerContent>
      </Drawer.Drawer>
    </>
  );
};
