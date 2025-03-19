import { GraphQLClient } from "graphql-request";

import { useQuery } from "@tanstack/react-query";
import { LIST_YEETS_FOR_ADDRESS } from "../utils/graphQueries";
import { YeeterItem, YeetsItem } from "../utils/types";
import { useContext } from "react";
import { getGraphUrl } from "../utils/endpoints";
import { DaoHooksContext } from "../providers/DaoHooksProvider";

export const useYeetersForAddress = ({
  chainid,
  address,
}: {
  chainid?: string;
  address?: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey || !chainid) {
    // throw new Error("DaoHooksContext must be used within a DaoHooksProvider");
    console.log(
      "useYeetersForAddress: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const yeeterUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "YEETER",
  });

  const graphQLClient = new GraphQLClient(yeeterUrl);

  type YeetsWithYeeter = YeetsItem & {
    yeeter: YeeterItem;
  };

  const { data, ...rest } = useQuery({
    queryKey: [`get-yeeters-address`, { chainid, address }],
    enabled: Boolean(chainid && address),
    queryFn: (): Promise<{
      yeets: YeetsWithYeeter[];
    }> => graphQLClient.request(LIST_YEETS_FOR_ADDRESS, { address }),
  });

  const organizedYeeters = data?.yeets.reduce(
    (acc: { yeeters: Record<string, YeeterItem> }, yeet: YeetsWithYeeter) => {
      if (acc.yeeters[yeet.yeeter.id]) {
        const existingYeets = acc.yeeters[yeet.yeeter.id].yeets || [];
        acc.yeeters[yeet.yeeter.id].yeets = [...existingYeets, yeet];
        return acc;
      } else {
        acc.yeeters[yeet.yeeter.id] = { ...yeet.yeeter, yeets: [yeet] };
        return acc;
      }
    },
    { yeeters: {} }
  );

  const yeeters =
    organizedYeeters &&
    Object.keys(organizedYeeters.yeeters).map((yeetid) => {
      return {
        ...organizedYeeters.yeeters[yeetid],
      };
    });

  return {
    yeeters: yeeters,
    allYeets: data?.yeets,
    ...rest,
  };
};
