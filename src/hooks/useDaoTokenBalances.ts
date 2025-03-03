import { useQuery } from "@tanstack/react-query";
import { SequenceIndexer } from "@0xsequence/indexer";
import { TokenBalance } from "@/lib/types";
import { getTokenIndexerUrl } from "@/lib/endpoints";

export const useDaoTokenBalances = ({
  chainid,
  safeAddress,
}: {
  chainid?: string;
  safeAddress?: string;
}) => {
  const url = getTokenIndexerUrl({
    chainid: chainid || "",
  });

  const { data, ...rest } = useQuery({
    queryKey: [
      `get-dao-token-balances${chainid}-${safeAddress}`,
      { chainid, safeAddress },
    ],
    enabled: Boolean(chainid && safeAddress && url),
    queryFn: async (): Promise<{
      tokens: TokenBalance[];
    }> => {
      const key = process.env.NEXT_PUBLIC_SEQUENCE_KEY;

      const indexer = new SequenceIndexer(url, key);

      const tokenBalances = await indexer.getTokenBalances({
        accountAddress: safeAddress,
        includeMetadata: true,
        includeCollectionTokens: false,
        metadataOptions: { verifiedOnly: true },
      });

      const balance = await indexer.getEtherBalance({
        accountAddress: safeAddress,
      });

      const transformedTokenBalances = tokenBalances.balances.map(
        (tokenBal) => {
          return {
            token: {
              decimals: tokenBal.contractInfo?.decimals,
              symbol: tokenBal.contractInfo?.symbol,
              name: tokenBal.contractInfo?.name,
              logoUri: tokenBal.contractInfo?.logoURI,
            },
            tokenAddress: tokenBal.contractAddress,
            balance: tokenBal.balance,
          };
        }
      );

      const nativeBalance = {
        tokenAddress: null,
        balance: balance.balance.balanceWei,
      };

      return { tokens: [nativeBalance, ...transformedTokenBalances] };
    },
  });

  return {
    tokens: data?.tokens,
    ...rest,
  };
};
