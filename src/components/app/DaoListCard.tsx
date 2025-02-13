"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useActiveDaoProposals } from "@/hooks/useActiveDaoProposals";
import { useDao } from "@/hooks/useDao";
import Link from "next/link";

interface DaoListCardProps {
  daoid: string;
  chainid: string;
}

export const DaoListCard = ({ daoid, chainid }: DaoListCardProps) => {
  const { dao, isLoading } = useDao({
    chainid,
    daoid,
  });
  const { proposals } = useActiveDaoProposals({
    chainid,
    daoid,
  });

  if (isLoading || !dao) return null;

  const imgSrc = dao.profile?.avatarImg || "/castle.svg";

  return (
    <Link href={`/dao/${chainid}/${daoid}`} className="w-full">
      <Card className="w-full bg-background border hover:bg-card transition-colors rounded-none">
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={imgSrc} alt={dao.name} />
            <AvatarFallback>{dao.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-foreground font-medium truncate">
              {dao.name.length > 25 ? `${dao.name.slice(0, 25)}...` : dao.name}
            </span>
            <span className="text-muted text-sm">
              {proposals?.length || 0} Active Proposals
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
