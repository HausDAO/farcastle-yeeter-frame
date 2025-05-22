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

  let yeeterUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "YEETER",
  });

  if (chainid === "0xaa36a7") {
    yeeterUrl =
      "https://api.studio.thegraph.com/query/73494/yeeter-sepolia/version/latest";
  }

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
      yeeters:
        | {
            id: string;
            createdAt: string;
            txHash: string;
          }[]
        | null;
    }> => {
      try {
        const graphQLClient = new GraphQLClient(yeeterUrl);
        const yeeterRes = (await graphQLClient.request(FIND_YEETER_BY_TX, {
          txHash,
        })) as {
          yeeters:
            | {
                id: string;
                createdAt: string;
                txHash: string;
              }[]
            | null;
        };

        if (!yeeterRes.yeeters || !yeeterRes.yeeters[0]) {
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

  return {
    yeeter: data?.yeeters && data.yeeters[0],
    isError: queryIsError || isRetryExhausted,
    ...rest,
  };
};
