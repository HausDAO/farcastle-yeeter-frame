import { useYeeter } from "@/hooks/useYeeter";
import { RaiseStats } from "./RaiseStats";

export const ClosedYeeter = ({
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
  if (!yeeter) return;
  return (
    <>
      <RaiseStats yeeter={yeeter} />
      <h2 className="text-4xl text-accent my-3">Raise has closed</h2>
    </>
  );
};
