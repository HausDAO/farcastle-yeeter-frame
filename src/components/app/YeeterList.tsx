"use client";

import { YeeterItem } from "@/lib/types";
import { toHex } from "viem";
import { useAccount } from "wagmi";
import { Card } from "../ui/card";
import { LoadingSpinner } from "../ui/loading";
import { YeeterListCard } from "./YeeterListCard";
import { useYeeters } from "@/hooks/useYeeters";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const YeeterList = ({ defaultChainId }: { defaultChainId: number }) => {
  const { chain } = useAccount();
  const [listType, setListType] = useState("open");

  const { yeeters, isLoading, isFetched } = useYeeters({
    chainid: toHex(defaultChainId || chain?.id || "0"),
    filter: listType,
  });

  const handleFilterChange = (e: string) => {
    console.log("e", e);
    setListType(e);
  };

  if (isLoading) return <LoadingSpinner />;

  if (isFetched && (!yeeters || yeeters.length === 0)) {
    return (
      <div className="flex flex-col flex-wrap items-center justify-center gap-2 w-full">
        <Select onValueChange={handleFilterChange} defaultValue={listType}>
          <SelectTrigger className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card rounded-none">
            <SelectItem value="open">Open Campaigns</SelectItem>
            <SelectItem value="closed">Closed Campaigns</SelectItem>
          </SelectContent>
        </Select>
        <Card className="w-full bg-background border rounded-none">
          <div className="flex justify-center p-4">
            <span className="text-primary font-display text-xl uppercase">
              No open campaigns in this realm
            </span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-2 w-full">
      <Select onValueChange={handleFilterChange} defaultValue={listType}>
        <SelectTrigger className="h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card rounded-none">
          <SelectItem value="open">Open Campaigns</SelectItem>
          <SelectItem value="closed">Closed Campaigns</SelectItem>
        </SelectContent>
      </Select>
      {isFetched &&
        yeeters?.map((yeeter: YeeterItem) => {
          return (
            <YeeterListCard
              key={yeeter.id}
              yeeterid={yeeter.id}
              chainid={`${toHex(defaultChainId || chain?.id || "0")}`}
            />
          );
        })}
    </div>
  );
};
