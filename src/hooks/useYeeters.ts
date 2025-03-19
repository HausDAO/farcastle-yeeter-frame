import { GraphQLClient } from "graphql-request";

import { useQuery } from "@tanstack/react-query";
import {
  LIST_OPEN_YEETERS,
  LIST_CLOSED_YEETERS,
  LIST_ALL_YEETERS,
} from "../lib/graph-queries";
import { YeeterItem } from "../lib/types";
import { useContext } from "react";
import { getGraphUrl } from "../lib/endpoints";
import { DaoHooksContext } from "../providers/DaoHooksProvider";

const QUERIES: Record<string, string> = {
  open: LIST_OPEN_YEETERS,
  all: LIST_ALL_YEETERS,
  closed: LIST_CLOSED_YEETERS,
};

// const SECONDS_IN_DAY = 86400;

export const useYeeters = ({
  chainid,
  filter,
}: {
  chainid: string;
  filter: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey) {
    // throw new Error("DaoHooksContext must be used within a DaoHooksProvider");
    console.log(
      "useYeeter: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const yeeterUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "YEETER",
  });

  const graphQLClient = new GraphQLClient(yeeterUrl);
  const nowInSeconds = (): number => new Date().getTime() / 1000;
  // const now = (nowInSeconds() - SECONDS_IN_DAY).toFixed().toString();
  const now = nowInSeconds().toFixed().toString();

  const query = QUERIES[filter];
  const variables = filter !== "all" ? { now } : undefined;

  const { data, ...rest } = useQuery({
    queryKey: [`list-yeeters`, { chainid, filter }],
    enabled: Boolean(chainid),
    queryFn: (): Promise<{
      yeeters: YeeterItem[];
    }> => graphQLClient.request(query, variables),
  });

  return {
    yeeters: data?.yeeters,
    ...rest,
  };
};
