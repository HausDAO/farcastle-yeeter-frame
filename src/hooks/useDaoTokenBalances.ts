import { useQuery } from "@tanstack/react-query";

import { TokenBalance } from "@/lib/types";
import { getGnosisUrl } from "@/lib/endpoints";
import { useDaoHooksConfig } from "@/providers/DaoHooksProvider";

import { getAddress } from "viem";

export const useDaoTokenBalances = ({
  chainid,
  safeAddress,
}: {
  chainid?: string;
  safeAddress?: string;
}) => {
  const { config } = useDaoHooksConfig();

  if (!config || !config.graphKey) {
    throw new Error("DaoHooksContext must be used within a DaoHooksProvider");
  }

  const gnosisUrl = getGnosisUrl({
    chainid: chainid || "",
  });

  const { data, ...rest } = useQuery({
    queryKey: [
      `get-dao-token-balances${chainid}-${safeAddress}`,
      { chainid, safeAddress },
    ],
    queryFn: async (): Promise<{
      tokens: TokenBalance[];
    }> => {
      let balances = [] as TokenBalance[];
      try {
        const res = await fetch(
          `${gnosisUrl}/safes/${getAddress(safeAddress || "")}/balances/?exclude_spam=true`
        );

        balances = await res.json();
      } catch (err) {
        console.log("token fetch error", err);
      }

      return { tokens: balances };
    },
    enabled: !!safeAddress && !!chainid,
  });

  return {
    tokens: data?.tokens,
    ...rest,
  };
};
