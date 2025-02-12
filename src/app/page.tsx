"use client";

import { DaoList } from "@/components/app/DaoList";
import { Button } from "@/components/ui/button";
import { DAO_CONFIG, HOLLOW_SERVANTS_DAO_ID } from "@/lib/constants";
import Link from "next/link";

const { DAO_ID, DAO_CHAIN } = DAO_CONFIG[HOLLOW_SERVANTS_DAO_ID];

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="w-full h-full space-y-4 pb-4 px-4">
      <div className="p-4 gap-2 flex flex-col items-center justify-center w-full relative text-primary">
        <div className="font-semibold text-lg text-center">
          You've found the doorway to the Quarters of the Hollow Servants
        </div>

        <Link href={`/dao/${DAO_CHAIN}/${DAO_ID}`}>
          <Button>Proceed with caution</Button>
        </Link>
        <div className="mt-10">
          <DaoList />
        </div>
      </div>
    </div>
  );
}
