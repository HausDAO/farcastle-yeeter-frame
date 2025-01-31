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

  const gnosisUrl = getGnosisUrl({
    chainid: chainid || "",
  });

  const { data, ...rest } = useQuery({
    queryKey: [
      `get-dao-token-balances${chainid}-${safeAddress}`,
      { chainid, safeAddress },
    ],
    enabled: Boolean(chainid && safeAddress && config?.graphKey),
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
  });

  return {
    tokens: data?.tokens,
    ...rest,
  };
};
