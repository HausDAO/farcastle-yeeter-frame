import Link from "next/link";
import Image from "next/image";

import { Button } from "../ui/button";
import { useDao } from "@/hooks/useDao";

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

  if (isLoading || !dao) return;

  console.log("dao", dao);
  // const imgSrc = dao.profile?.avatarImg || "/castle.svg";
  const imgSrc = "/castle.svg";

  return (
    <Link key={daoid} href={`/dao/${chainid}/${daoid}`}>
      <div>
        <Image src={imgSrc} width={45} height={45} alt="dao logo" priority />

        <Button size="sm" variant="secondary">
          {dao.name}
        </Button>
      </div>
    </Link>
  );
};
