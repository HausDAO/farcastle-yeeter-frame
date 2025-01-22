import { GraphQLClient } from "graphql-request";
import { useQuery } from "@tanstack/react-query";

import { DaoItem, DaoProfile, RecordItem } from "@/lib/types";
import { getGraphUrl } from "@/lib/endpoints";
import { FIND_DAO } from "@/lib/graph-queries";
import { useDaoHooksConfig } from "@/providers/DaoHooksProvider";

export const addParsedContent = <T>(record?: RecordItem): T | undefined => {
  if (record?.contentType === "json") {
    try {
      const obj = JSON.parse(record.content);
      return obj;
    } catch (e) {
      console.log("err", e);
      return;
    }
  }
};

export const useDao = ({
  chainid,
  daoid,
}: {
  chainid?: string;
  daoid?: string;
}) => {
  const { config } = useDaoHooksConfig();

  if (!config || !config.graphKey) {
    throw new Error("DaoHooksContext must be used within a DaoHooksProvider");
  }

  const dhUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: config.graphKey,
    subgraphKey: "DAOHAUS",
  });

  const graphQLClient = new GraphQLClient(dhUrl);

  const { data, ...rest } = useQuery({
    queryKey: [`get-dao-${chainid}-${daoid}`, { chainid, daoid }],
    queryFn: async (): Promise<{
      dao: DaoItem;
    }> => {
      const daores = (await graphQLClient.request(FIND_DAO, {
        daoid,
      })) as {
        dao: DaoItem;
      };
      const profile = addParsedContent<DaoProfile>(daores.dao.rawProfile[0]);

      return {
        dao: { ...daores.dao, profile },
      };
    },
    enabled: !!daoid && !!chainid,
  });

  return {
    dao: data?.dao,
    ...rest,
  };
};
