import { http, createConfig, useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { YeetsItem } from "../../lib/types";
import { fromWei, truncateAddress } from "../../lib/helpers";
import { formatValueTo } from "../../lib/units";
import { HAUS_RPC_DEFAULTS } from "../../lib/constants";
import { AvatarDisplay } from "./AvatarDisplay";

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(HAUS_RPC_DEFAULTS["0x1"]),
  },
});

export const YeetMessage = ({ yeet }: { yeet: YeetsItem }) => {
  const result = useEnsName({
    config,
    address: yeet.contributor as `0x${string}`,
  });

  const name = result.data;

  return (
    <div className="text-left w-full mb-3">
      <p>{yeet.message || "yeet"}</p>
      <div className="flex flex-wrap items-center justify-between gap-5 mt-1">
        <p className="text-base font-bold">{`${formatValueTo({
          value: fromWei(yeet.amount),
          decimals: 3,
          format: "numberShort",
        })} ETH`}</p>
        <div className="flex flex-row gap-5 items-centered text-sm">
          <AvatarDisplay name={name} />
          <p className="leading-8">
            {name || truncateAddress(yeet.contributor)}
          </p>
        </div>
      </div>
    </div>
  );
};
