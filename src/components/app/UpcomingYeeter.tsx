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
    <div className="flex flex-col w-full items-center gap-2">
      <RaiseStats yeeter={yeeter} />
      <div className="w-full px-8 mb-2">
        <Button variant="default" className="w-full" onClick={openUrl}>
          Share Campaign
        </Button>
      </div>
    </div>
  );
};
