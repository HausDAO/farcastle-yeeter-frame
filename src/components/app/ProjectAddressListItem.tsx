import { createConfig, http, useEnsName } from "wagmi";
import { toWholeUnits, truncateAddress } from "../../lib/helpers";
import { mainnet } from "viem/chains";
import { HAUS_RPC_DEFAULTS } from "../../lib/constants";
import { formatDateFromSeconds } from "../../lib/dates";
import { ExitItem } from "../../lib/types";
import { AvatarDisplay } from "./AvatarDisplay";

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(HAUS_RPC_DEFAULTS["0x1"]),
  },
});

export const ProjectAddressListItem = ({
  memberAddress,
  exit,
}: {
  memberAddress: string;
  exit?: ExitItem;
}) => {
  const { data } = useEnsName({
    config,
    address: memberAddress as `0x${string}`,
  });

  return (
    <div className="flex flex-row gap-5 items-centered">
      <AvatarDisplay name={data} />
      <p className="leading-8">{data || truncateAddress(memberAddress)}</p>
      {exit && (
        <>
          <p className="leading-8 text-xs">
            {toWholeUnits(exit.loot)} loot tokens on{" "}
            {formatDateFromSeconds(exit.createdAt)}
          </p>
        </>
      )}
    </div>
  );
};
