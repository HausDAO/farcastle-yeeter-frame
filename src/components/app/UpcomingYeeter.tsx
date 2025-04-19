import { useYeeter } from "@/hooks/useYeeter";
import { RaiseStats } from "./RaiseStats";
import { YeetTx } from "./YeetTx";

export const UpcomingYeeter = ({
  yeeterid,
  chainid,
}: {
  yeeterid?: string;
  chainid?: string;
}) => {
  const { yeeter } = useYeeter({
    chainid,
    yeeterid,
  });

  if (!yeeterid || !chainid || !yeeter) return;

  return (
    <div className="space-y-2 w-full mb-4">
      <RaiseStats yeeter={yeeter} />
      <YeetTx yeeterid={yeeterid} chainid={chainid} />
    </div>
  );
};
