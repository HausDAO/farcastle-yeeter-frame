import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";

import { LIST_YEETS } from "../lib/graph-queries";
import { YeetsItem } from "../lib/types";
import { useContext } from "react";
import { DaoHooksContext } from "../providers/DaoHooksProvider";
import { getGraphUrl } from "../lib/endpoints";

export const useYeets = ({
  chainid,
  yeeterid,
}: {
  chainid: string;
  yeeterid: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey) {
    // throw new Error("DaoHooksContext must be used within a DaoHooksProvider");

    console.log(
      "useYeets: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const yeeterUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "YEETER",
  });

  const graphQLClient = new GraphQLClient(yeeterUrl);

  const { data, ...rest } = useQuery({
    queryKey: [`list-yeets`, { yeeterid }],
    enabled: Boolean(chainid && yeeterid),
    queryFn: (): Promise<{
      yeets: YeetsItem[];
    }> => graphQLClient.request(LIST_YEETS, { shamanAddress: yeeterid }),
  });

  return {
    yeets: data?.yeets,
    ...rest,
  };
};
