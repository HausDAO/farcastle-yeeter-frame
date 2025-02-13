"use client";

import { Card } from "@/components/ui/card";
import { default as dynamicImport } from "next/dynamic";
import Image from "next/image";

const DaoList = dynamicImport(
  () => import("@/components/app/DaoList").then((mod) => mod.DaoList),
  {
    ssr: false,
  }
);

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="w-full h-full space-y-4 pb-4 px-4">
      <Card className="flex flex-col items-center px-4 pt-4 pb-8 rounded-none">
        <div className="text-muted font-display text-3xl uppercase mb-4">
          Enter the Gates
        </div>

        <div className="w-full">
          <div className="relative w-3/4 aspect-square mx-auto">
            <Image src="/gate.svg" alt="Gate" fill className="object-contain" />
          </div>

          <div className="flex flex-col w-full px-4 mt-8">
            <DaoList />
          </div>
        </div>
      </Card>
    </div>
  );
}
