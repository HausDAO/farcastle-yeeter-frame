import { createConfig, http, useEnsAvatar } from "wagmi";
import { HAUS_RPC_DEFAULTS } from "../../lib/constants";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { GetEnsNameReturnType } from "wagmi/actions";
import Image from "next/image";

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(HAUS_RPC_DEFAULTS["0x1"]),
  },
});

export const AvatarDisplay = ({ name }: { name?: GetEnsNameReturnType }) => {
  const { data: avatar } = useEnsAvatar({
    config,
    name: normalize(name || ""),
  });

  return (
    <div className="flex flex-row gap-5 items-centered">
      <div className="avatar">
        <div className="w-8 rounded">
          <Image
            src={avatar || `/gate-dark-purple.svg`}
            alt="Gate"
            width="30"
            height="30"
          />
        </div>
      </div>
    </div>
  );
};
