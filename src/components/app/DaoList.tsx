"use client";

import { useDaosForAddress } from "@/hooks/useDaosForAddress";
import { DaoItem } from "@/lib/types";
import { toHex } from "viem";
import { useAccount } from "wagmi";
import { LoadingSpinner } from "../ui/loading";
import { DaoListCard } from "./DaoListCard";

export const DaoList = () => {
  const { address, chain } = useAccount();

  const { daos, isLoading, isFetched } = useDaosForAddress({
    chainid: toHex(chain?.id || "0"),
    address,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-2 w-full">
      {isFetched &&
        daos?.map((dao: DaoItem) => {
          return (
            <DaoListCard
              key={dao.id}
              daoid={dao.id}
              chainid={`${toHex(chain?.id || "0")}`}
            />
          );
        })}
    </div>
  );
};
