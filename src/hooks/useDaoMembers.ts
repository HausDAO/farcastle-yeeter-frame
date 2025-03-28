import { GraphQLClient } from "graphql-request";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { MemberItem, SubgraphQueryOrderPaginationOptions } from "../lib/types";
import { getGraphUrl } from "../lib/endpoints";
import { DaoHooksContext } from "../providers/DaoHooksProvider";
import { LIST_ALL_DAO_SHAREHOLDERS } from "../lib/graph-queries";

export const useDaoMembers = ({
  chainid,
  daoid,
  queryOptions,
}: {
  chainid?: string;
  daoid?: string;
  queryOptions?: SubgraphQueryOrderPaginationOptions;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey) {
    console.error(
      "useDaoMembers: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const dhUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "DAOHAUS",
  });

  const graphQLClient = new GraphQLClient(dhUrl);

  const { data, ...rest } = useQuery({
    queryKey: [`list-members`, { chainid, daoid }],
    enabled: Boolean(chainid && daoid),
    queryFn: async (): Promise<{
      members: MemberItem[];
    }> => {
      const res = (await graphQLClient.request(LIST_ALL_DAO_SHAREHOLDERS, {
        first: queryOptions?.first || 100,
        skip: queryOptions?.skip || 0,
        orderBy: queryOptions?.orderBy || "createdAt",
        orderDirection: queryOptions?.orderDirection || "desc",
        daoid,
      })) as {
        members: MemberItem[];
      };

      return {
        members: res.members,
      };
    },
  });

  return {
    members: data?.members,
    ...rest,
  };
};
