"use client";

import { useEnsAvatar, useEnsName } from "wagmi";
import Image from "next/image";

interface UserAvatarProps {
  address?: `0x${string}`;
  size?: number;
}

export function UserAvatar({ address, size = 32 }: UserAvatarProps) {
  const { data: ensName } = useEnsName({
    address,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || undefined,
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={ensAvatar || "/images/skull.png"}
        alt={ensName || "User avatar"}
        fill
        className="rounded-full object-cover border-2 border-primary"
      />
    </div>
  );
}
