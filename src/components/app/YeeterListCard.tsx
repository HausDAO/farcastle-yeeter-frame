"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useYeeter } from "@/hooks/useYeeter";
import { formatShortDateTimeFromSeconds } from "@/lib/dates";
import { nativeCurrencySymbol, toWholeUnits } from "@/lib/helpers";
import Link from "next/link";
import { useChainId, useChains } from "wagmi";

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

  const chainId = useChainId();
  const chains = useChains();
  const activeChain = chains.find((c) => c.id === chainId);

  if (daoLoading || !yeeter) return null;

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
          <div className="flex flex-col">
            <span className="text-foreground font-medium truncate">
              {yeeterName.length > 25
                ? `${yeeterName.slice(0, 25)}...`
                : yeeterName}
            </span>
            <span className="text-muted text-sm">
              Raised
              {` ${Number(toWholeUnits(yeeter?.balance)).toFixed(5)} of `}
              {toWholeUnits(yeeter?.goal)} {nativeCurrencySymbol(activeChain)}{" "}
              goal
            </span>
            {yeeter.isEnded && (
              <span className="text-secondary text-sm">
                contributions closed
              </span>
            )}
            {yeeter.isComingSoon && (
              <span className="text-secondary text-sm">
                Opening on {formatShortDateTimeFromSeconds(yeeter.startTime)}
              </span>
            )}
            {yeeter.isActive && (
              <span className="text-secondary text-sm">
                {" "}
                Closing on {formatShortDateTimeFromSeconds(yeeter.endTime)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
