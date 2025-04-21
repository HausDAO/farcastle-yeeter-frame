import { useYeeter } from "@/hooks/useYeeter";
import { RaiseStats } from "./RaiseStats";
import { useCallback } from "react";
import { composeCastUrl } from "@/lib/constants";
import sdk from "@farcaster/frame-sdk";
import { Button } from "../ui/button";

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

  const openUrl = useCallback(() => {
    sdk.actions.openUrl(`${composeCastUrl}/yeeter/${chainid}/${yeeterid}`);
  }, [yeeterid, chainid]);

  if (!yeeterid || !chainid || !yeeter) return;

  return (
    <div className="space-y-2 w-full mb-4">
      <RaiseStats yeeter={yeeter} />
      <Button variant="default" className="w-full" onClick={openUrl}>
        Share Campaign
      </Button>
    </div>
  );
};
