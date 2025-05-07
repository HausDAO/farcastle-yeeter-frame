"use client";

import { NetworkSwitcher } from "@/components/app/NetworkSwitcher";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { ConnectWallet } from "../app/ConnectWallet";

function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const onExploreClick = React.useCallback(() => {
    router.push("/explore");
  }, [router]);

  const onLaunchClick = React.useCallback(() => {
    router.push("/launch");
  }, [router]);

  return (
    <div className="w-full flex flex-row items-end justify-between p-4">
      <NetworkSwitcher />
      <div className="text-3xl font-fraktur pt-[2px] leading-[30px] h-[30px] text-primary flex gap-2">
        <span
          className="hover:cursor-pointer"
          onClick={onExploreClick}
        >
          explore
        </span>
        <span className="mx-2 h-[28px] w-px bg-muted inline-block align-middle"></span>
        <span
          className="hover:cursor-pointer"
          onClick={onLaunchClick}
        >
          launch
        </span>
      </div>
      <ConnectWallet />
    </div>
  );
}

export { Header };
