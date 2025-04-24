"use client";

import { NetworkSwitcher } from "@/components/app/NetworkSwitcher";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { ConnectWallet } from "../app/ConnectWallet";

function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const onTitleClick = React.useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="w-full flex flex-row items-end justify-between p-4">
      <NetworkSwitcher />
      <div
        className={`text-3xl font-fraktur pt-[2px] leading-[30px] h-[30px] text-primary ${pathname !== "/" ? "hover:cursor-pointer" : ""}`}
        onClick={onTitleClick}
      >
        fundraiser
      </div>
      <ConnectWallet />
    </div>
  );
}

export { Header };
