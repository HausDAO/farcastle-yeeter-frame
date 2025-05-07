import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useYeeter } from "@/hooks/useYeeter";
import { ProjectTeamList } from "./ProjectTeam";
import { useAccount } from "wagmi";
import { useMember } from "@/hooks/useMember";
import Link from "next/link";
import { useCallback, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loading";

const truncateButtonLabel = (label: string) => {
  if (label.length > 20) {
    return label.slice(0, 20) + "...";
  }
  return label;
};

export const YeeterAbout = ({
  yeeterid,
  chainid,
  daoid,
}: {
  yeeterid?: string;
  chainid?: string;
  daoid?: string;
}) => {
  const [isCasting, setIsCasting] = useState(false);
  const { yeeter, metadata } = useYeeter({
    chainid,
    yeeterid,
  });
  const { address } = useAccount();
  const { member } = useMember({
    daoid,
    chainid,
    memberaddress: address,
  });

  const handleCastCampaign = useCallback(async () => {
    try {
      setIsCasting(true);
      // Use window.location.origin in development, fallback to env var in production
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
      // You might want to show a toast or notification here
    } finally {
      setIsCasting(false);
    }
  }, [yeeterid, chainid, metadata?.missionStatement]);

  const onProjectTeam = address && member && Number(member.shares) > 0;

  if (!yeeterid || !chainid || !yeeter) return;

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-14 border-b border-border">
        <TabsTrigger value="about" className="text-muted font-display text-2xl uppercase text-center data-[state=active]:text-primary data-[state=active]:bg-card">About</TabsTrigger>
        <TabsTrigger value="links" className="text-muted font-display text-2xl uppercase text-center data-[state=active]:text-primary data-[state=active]:bg-card">Links</TabsTrigger>
        <TabsTrigger value="team" className="text-muted font-display text-2xl uppercase text-center data-[state=active]:text-primary data-[state=active]:bg-card">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="about">
        <Card className="border-0 px-8 pt-2">
          {metadata?.missionStatement && (
            <CardContent className="p-0 pb-4">
              <div className="text-muted text-sm mb-4 uppercase">Mission</div>
              <div className="leading-relaxed">{metadata?.missionStatement}</div>
            </CardContent>
          )}
          {metadata?.projectDetails && (
            <CardContent className="p-0 pb-4">
              <div className="text-muted text-sm mb-4 uppercase">Details</div>
              <div className="leading-relaxed">{metadata?.projectDetails}</div>
            </CardContent>
          )}

          {onProjectTeam && (
            <CardContent className="p-0 mt-2">
              <div className="w-full">
                <Link href={`/yeeter/${chainid}/${yeeterid}/update`} className="block w-full">
                  <Button variant="default" className="w-full">
                    Edit Campaign Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </TabsContent>
      <TabsContent value="links">
        <Card className="border-0 pt-4 px-4">
          <CardContent className="w-full px-4 pb-0">
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={handleCastCampaign}
                  disabled={isCasting}
                >
                  {isCasting ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    "Share Campaign"
                  )}
                </Button>
              </div>

              {metadata?.parsedLinks &&
                metadata.parsedLinks.map((link, i) => {
                  if (!link.url) return null;
                  return (
                    <div className="w-full" key={i}>
                      <Link href={link.url} target="_blank" className="block w-full">
                        <Button variant="secondary" className="w-full">
                          {truncateButtonLabel(link.label)}
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              <div className="w-full">
                <Link href={`https://admin.daohaus.club/#/molochv3/${chainid}/${yeeter.dao.id}/safes`} target="_blank" className="block w-full">
                  <Button variant="tertiary" className="w-full">
                    View Treasury
                  </Button>
                </Link>
              </div>
            </div>
            {onProjectTeam && (
              <div className="w-full">
                <Link href={`/yeeter/${chainid}/${yeeterid}/update`} className="block w-full">
                  <Button variant="default" className="w-full mt-4">
                    Edit Campaign Details
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="team">
        <Card className="border-0 px-8 pt-2">
          <CardContent className="p-0">
            <div className="text-muted text-sm mb-4 uppercase">Members</div>
            <ProjectTeamList
              chainid={chainid}
              yeeterid={yeeterid}
              daoid={yeeter.dao.id}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};