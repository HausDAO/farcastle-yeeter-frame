"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { EnsAvatar } from "./EnsAvatar";

interface UserAvatarProps {
  address?: `0x${string}`;
  size?: number;
}

export function UserAvatar({ address, size = 32 }: UserAvatarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src="/images/skull.png"
          alt="User avatar"
          fill
          className="rounded-full object-cover border-2 border-primary"
        />
      </div>
    );
  }

  return <EnsAvatar address={address} size={size} />;
}
