import { http, createConfig, useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { YeetsItem } from "../../lib/types";
import { fromWei, truncateAddress, charLimit } from "../../lib/helpers";
import { formatValueTo } from "../../lib/units";
import { HAUS_RPC_DEFAULTS } from "../../lib/constants";
import { AvatarDisplay } from "./AvatarDisplay";
import { Card, CardContent } from "@/components/ui/card";

interface FarcasterUser {
  pfp_url: string;
  username: string;
}

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(HAUS_RPC_DEFAULTS["0x1"]),
  },
});

export const YeetMessage = ({
  yeet,
  farcasterUsers,
}: {
  yeet: YeetsItem;
  farcasterUsers?: FarcasterUser[];
}) => {
  const result = useEnsName({
    config,
    address: yeet.contributor as `0x${string}`,
  });

  const name = result.data;

  const farcasterUser = farcasterUsers && farcasterUsers[0];

  return (
    <Card className="border-0 mb-4">
      <CardContent className="p-0">
        <div className="mb-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-4 items-center text-sm">
              <AvatarDisplay
                name={name}
                farcasterPfp={farcasterUser?.pfp_url}
              />
              {farcasterUser && <p>{charLimit(farcasterUser.username, 20)}</p>}
              {!farcasterUser && (
                <p>
                  {name
                    ? charLimit(name, 20)
                    : truncateAddress(yeet.contributor)}
                </p>
              )}
            </div>
            <p className="stat-value text-lg">{`${formatValueTo({
              value: fromWei(yeet.amount),
              decimals: 3,
              format: "numberShort",
            })} ETH`}</p>
          </div>
          <p className="mt-2 leading-relaxed">{yeet.message || "YEET"}</p>
        </div>
      </CardContent>
    </Card>
  );
};
