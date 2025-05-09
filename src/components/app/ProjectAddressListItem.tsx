import { createConfig, http, useEnsName } from "wagmi";
import { toWholeUnits, truncateAddress } from "../../lib/helpers";
import { mainnet } from "viem/chains";
import { HAUS_RPC_DEFAULTS } from "../../lib/constants";
import { formatDateFromSeconds } from "../../lib/dates";
import { ExitItem, FarcasterUser } from "../../lib/types";
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
  farcasterUsers,
}: {
  memberAddress: string;
  farcasterUsers?: FarcasterUser[];
  exit?: ExitItem;
}) => {
  const { data } = useEnsName({
    config,
    address: memberAddress as `0x${string}`,
  });

  const farcasterUser = farcasterUsers && farcasterUsers[0];

  return (
    <div className="flex flex-row gap-5 items-centered">
      <AvatarDisplay name={data} farcasterPfp={farcasterUser?.pfp_url} />
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
