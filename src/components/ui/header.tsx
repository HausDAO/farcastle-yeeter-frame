"use client";

import Image from "next/image";
import { useParams, useRouter, usePathname } from "next/navigation";
import React from "react";

function HeaderLogoSvg({
  className,
  onClick,
}: {
  className: string;
  onClick: () => void;
}) {
  return (
    <Image
      src="/castle.svg"
      width={45}
      height={45}
      alt="Castle logo"
      className={className}
      onClick={onClick}
      priority
    />
  );
}

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ chainid: string; daoid: string }>();

  const onLogoClick = React.useCallback(() => {
    router.push("/");
  }, [router]);

  const onTitleClick = React.useCallback(() => {
    if (params.chainid && params.daoid) {
      router.push(`/dao/${params.chainid}/${params.daoid}`);
    }
  }, [router, params]);

  return (
    <div className="w-full flex flex-row items-end justify-between p-4">
      <div className="opacity-0 h-[30px] w-[30px]" />
      <div
        className={`text-3xl font-fraktur pt-[2px] leading-[30px] h-[30px] text-primary ${pathname !== "/" ? "hover:cursor-pointer" : ""}`}
        onClick={onTitleClick}
      >
        proposals
      </div>
      <HeaderLogoSvg
        className="opacity-100 hover:cursor-pointer"
        onClick={onLogoClick}
      />
    </div>
  );
}

export { Header };
