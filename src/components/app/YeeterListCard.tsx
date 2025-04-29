"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useYeeter } from "@/hooks/useYeeter";
import { formatDateFromSeconds } from "@/lib/dates";
import { nativeCurrencySymbol, toWholeUnits } from "@/lib/helpers";
import Link from "next/link";
import { useAccount, useChains } from "wagmi";
import { Progress } from "../ui/progress";
import { calcProgressPerc } from "@/lib/yeet-helpers";

interface YeeterListCardProps {
  yeeterid: string;
  chainid: string;
}

export const YeeterListCard = ({ yeeterid, chainid }: YeeterListCardProps) => {
  const {
    yeeter,
    metadata,
    isLoading: daoLoading,
  } = useYeeter({
    chainid,
    yeeterid,
  });

  const { chainId } = useAccount();
  const chains = useChains();
  const activeChain = chains.find((c) => c.id === chainId);

  if (daoLoading || !yeeter) return null;

  const perc = calcProgressPerc(yeeter.balance, yeeter.goal);
  const imgSrc =
    (metadata?.icon && metadata?.icon !== "" && metadata?.icon) || "/gate.svg";
  const yeeterName = metadata?.name ? metadata.name : "--";

  return (
    <Link href={`/yeeter/${chainid}/${yeeterid}`} className="w-full">
      <Card className="w-full bg-background border hover:bg-card transition-colors rounded-none">
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={imgSrc} alt={yeeterName} />
            <AvatarFallback>{yeeterName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 w-full">
            <span className="text-foreground font-medium truncate mb-1">
              {yeeterName.length > 25
                ? `${yeeterName.slice(0, 25)}...`
                : yeeterName}
            </span>
            <div className="w-full max-w-[200px]">
              <Progress value={perc} className="w-full" />
            </div>
            <span className="text-muted text-xs">
              {` ${Number(toWholeUnits(yeeter?.balance)).toFixed(5)} of `}
              {toWholeUnits(yeeter?.goal)} {nativeCurrencySymbol(activeChain)}{" "}
            </span>
            {yeeter.isEnded && (
              <span className="text-primary text-sm">
                Closed on {formatDateFromSeconds(yeeter.endTime)}
              </span>
            )}
            {yeeter.isComingSoon && (
              <span className="text-primary text-sm">
                Opening on {formatDateFromSeconds(yeeter.startTime)}
              </span>
            )}
            {yeeter.isActive && (
              <span className="text-primary text-sm">
                {" "}
                Closing on {formatDateFromSeconds(yeeter.endTime)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
