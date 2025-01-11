"use client";

import { Button } from "@/components/ui/button";
import { DAO_CONFIG, HOLLOW_SERVANTS_DAO_ID } from "@/lib/dao-constants";
import Link from "next/link";
import React from "react";

const { DAO_ID, DAO_CHAIN } = DAO_CONFIG[HOLLOW_SERVANTS_DAO_ID];

export default function Home() {
  return (
    <div className="w-full h-full space-y-4 pb-4 px-4">
      <div className="p-4 gap-2 flex flex-col items-center justify-center w-full relative text-secondary">
        <div className="font-semibold text-lg text-center">
          You've found your way into the Quarters of the Hollow Servants
        </div>

        <Link href={`/dao/${DAO_CHAIN}/${DAO_ID}`}>
          <Button>Proceed with caution</Button>
        </Link>
      </div>
    </div>
  );
}
