import { GraphQLClient } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { FIND_YEETER_BY_TX } from "../lib/graph-queries";
import { useContext } from "react";
import { DaoHooksContext } from "../providers/DaoHooksProvider";
import { getGraphUrl } from "../lib/endpoints";

export const useYeeterByTx = ({
  chainid,
  txHash,
}: {
  chainid?: string;
  txHash?: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey || !chainid || !txHash) {
    console.log(
      "useYeeterByTx: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const yeeterUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "YEETER",
  });

  const {
    data,
    isError: queryIsError,
    failureCount,
    ...rest
  } = useQuery({
    queryKey: [`get-yeeter-by-tx`, { chainid, txHash }],
    enabled: Boolean(chainid && txHash && typeof window !== "undefined"),
    retry: 10,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    queryFn: async (): Promise<{
      yeeter: {
        id: string;
        createdAt: string;
        txHash: string;
      } | null;
    }> => {
      try {
        const graphQLClient = new GraphQLClient(yeeterUrl);
        const yeeterRes = (await graphQLClient.request(FIND_YEETER_BY_TX, {
          txHash,
        })) as {
          yeeter: {
            id: string;
            createdAt: string;
            txHash: string;
          } | null;
        };

        if (!yeeterRes.yeeter) {
          throw new Error("Yeeter not found for transaction");
        }

        return yeeterRes;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to fetch yeeter by transaction");
      }
    },
  });

  // Check if we've exhausted all retries
  const isRetryExhausted = failureCount >= 10;

  console.log("queryIsError", queryIsError);

  return {
    yeeter: data?.yeeter,
    isError: queryIsError || isRetryExhausted,
    ...rest,
  };
};
