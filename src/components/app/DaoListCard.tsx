import Link from "next/link";
import Image from "next/image";

import { Button } from "../ui/button";
import { useDao } from "@/hooks/useDao";
import { useActiveDaoProposals } from "@/hooks/useActiveDaoProposals";

export const DaoListCard = ({
  daoid,
  chainid,
}: {
  daoid: string;
  chainid: string;
}) => {
  const { dao, isLoading } = useDao({
    chainid,
    daoid,
  });
  const { proposals } = useActiveDaoProposals({
    chainid,
    daoid,
  });

  if (isLoading || !dao) return;

  console.log("dao", dao);
  const imgSrc = dao.profile?.avatarImg || "/castle.svg";

  return (
    <Link key={daoid} href={`/dao/${chainid}/${daoid}`}>
      <div>
        <Image src={imgSrc} width={45} height={45} alt="dao logo" priority />

        <Button size="sm" variant="secondary">
          {dao.name}
        </Button>
        {proposals && proposals.length > 0 && (
          <p>active proposals: {proposals.length}</p>
        )}
      </div>
    </Link>
  );
};
