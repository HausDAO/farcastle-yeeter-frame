import { createConfig, http, useEnsAvatar } from "wagmi";
import { HAUS_RPC_DEFAULTS } from "../../lib/constants";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { GetEnsNameReturnType } from "wagmi/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";

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
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div className="flex flex-row gap-5 items-centered">
      <Avatar className="h-10 w-10">
        {!imgError && avatar ? (
          <Image
            src={avatar}
            alt={name || "Skull"}
            width={40}
            height={40}
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <Image
            src="/images/skull.png"
            alt="Skull"
            width={120}
            height={120}
            quality={100}
            className="h-full w-full"
            priority
          />
        )}
        <AvatarFallback>{name ? name[0] : ""}</AvatarFallback>
      </Avatar>
    </div>
  );
};
