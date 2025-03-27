import { useYeeter } from "@/hooks/useYeeter";
import { RaiseStats } from "./RaiseStats";
import { Button } from "../ui/button";

export const ActiveYeeter = ({
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
    <>
      <RaiseStats yeeter={yeeter} />
      <Button>Contribute</Button>
    </>
  );
};
