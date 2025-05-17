import { useYeeter } from "@/hooks/useYeeter";
import { RaiseStats } from "./RaiseStats";
import { useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { Button } from "../ui/button";

export const UpcomingYeeter = ({
  yeeterid,
  chainid,
}: {
  yeeterid?: string;
  chainid?: string;
}) => {
  const { yeeter, metadata } = useYeeter({
    chainid,
    yeeterid,
  });

  const handleCastCampaign = useCallback(async () => {
    try {
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_URL || "https://fundraiser.farcastle.net";
      const campaignUrl = `${baseUrl}/yeeter/${chainid}/${yeeterid}`;
      
      await sdk.actions.composeCast({ 
        text: metadata?.missionStatement || '',
        embeds: [campaignUrl]
      });
    } catch (error) {
      console.error('Error composing cast:', error);
    }
  }, [yeeterid, chainid, metadata?.missionStatement]);

  if (!yeeterid || !chainid || !yeeter) return;

  return (
    <div className="flex flex-col w-full items-center gap-2">
      <RaiseStats yeeter={yeeter} />
      <div className="w-full px-8 mb-2">
        <Button 
          variant="default" 
          className="w-full" 
          onClick={handleCastCampaign}
        >
          Share Campaign
        </Button>
      </div>
    </div>
  );
};
