import { GraphQLClient } from "graphql-request";

import { useQuery } from "@tanstack/react-query";
import { FIND_YEETER, FIND_YEETER_PROFILE } from "../lib/graph-queries";
import { YeeterItem, YeeterMetadata, RecordItem } from "../lib/types";
import {
  addParsedContent,
  addParsedLinks,
  addParsedRewards,
  calcYeetIsActive,
  calcYeetIsComingSoon,
  calcYeetIsEnded,
  calcYeetIsFull,
} from "../lib/yeet-helpers";
import { getGraphUrl } from "../lib/endpoints";
import { useContext } from "react";
import { DaoHooksContext } from "../providers/DaoHooksProvider";

export const useYeeter = ({
  chainid,
  yeeterid,
}: {
  chainid?: string;
  yeeterid?: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey || !chainid || !yeeterid) {
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
  const dhUrl = getGraphUrl({
    chainid: chainid || "",

    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "DAOHAUS",
  });

  const graphQLClient = new GraphQLClient(yeeterUrl);
  const hausGraphQLClient = new GraphQLClient(dhUrl);

  const { data, ...rest } = useQuery({
    queryKey: [`get-yeeter`, { chainid, yeeterid }],
    enabled: Boolean(chainid && yeeterid),
    queryFn: async (): Promise<{
      yeeter: YeeterItem;
      metadata: YeeterMetadata;
    }> => {
      const yeeterRes = (await graphQLClient.request(FIND_YEETER, {
        shamanAddress: yeeterid,
      })) as {
        yeeter: YeeterItem;
      };

      const records = (await hausGraphQLClient.request(FIND_YEETER_PROFILE, {
        daoid: yeeterRes.yeeter.dao.id,
      })) as {
        records: RecordItem[];
        dao: {
          name: string;
        };
      };

      const profileMatch =
        records.records.find((record) => {
          // find "yeeterId":"
          let recordYeeterId;
          if (record.content.indexOf(`"yeeterId":"`) > -1) {
            recordYeeterId = record.content
              .split(`"yeeterId":"`)[1]
              ?.split(`"`)[0];
          }

          return recordYeeterId === yeeterid;
        }) || records.records[0];

      const yeeter = {
        ...yeeterRes.yeeter,
        isActive: yeeterRes.yeeter && calcYeetIsActive(yeeterRes.yeeter),
        isEnded: yeeterRes.yeeter && calcYeetIsEnded(yeeterRes.yeeter),
        isComingSoon:
          yeeterRes.yeeter && calcYeetIsComingSoon(yeeterRes.yeeter),
        isFull: yeeterRes.yeeter && calcYeetIsFull(yeeterRes.yeeter),
      } as YeeterItem;

      const metadataOne = addParsedContent<YeeterMetadata>(profileMatch);
      const metadata = addParsedLinks(addParsedRewards(metadataOne));

      return {
        yeeter: yeeter,
        metadata: {
          ...metadata,
          name: metadata?.name || records?.dao.name,
        } as YeeterMetadata,
      };
    },
  });

  return {
    yeeter: data?.yeeter,
    metadata: data?.metadata,
    ...rest,
  };
};
