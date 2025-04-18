import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useYeeter } from "@/hooks/useYeeter";
import { ProjectTeamList } from "../ProjectTeam";
import { useAccount } from "wagmi";
import { useMember } from "@/hooks/useMember";
import Link from "next/link";
import { useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { composeCastUrl } from "@/lib/constants";
import { Button } from "../ui/button";

export const YeeterAbout = ({
  yeeterid,
  chainid,
  daoid,
}: {
  yeeterid?: string;
  chainid?: string;
  daoid?: string;
}) => {
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

  const openUrl = useCallback(() => {
    sdk.actions.openUrl(`${composeCastUrl}/yeeter/${chainid}/${yeeterid}`);
  }, [yeeterid, chainid]);

  const onProjectTeam = address && member && Number(member.shares) > 0;

  if (!yeeterid || !chainid || !yeeter) return;

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="links">Links</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="about">
        <Card className="border-0">
          <CardHeader>
            <CardDescription>What are we funding?</CardDescription>
          </CardHeader>
          {metadata?.missionStatement && (
            <CardContent className="space-y-1">
              <div className="font-bold">Mission</div>
              <div className="space-y-1">{metadata?.missionStatement}</div>
            </CardContent>
          )}
          {metadata?.projectDetails && (
            <CardContent className="space-y-1">
              <div className="font-bold">Details</div>
              <div className="space-y-1">{metadata?.projectDetails}</div>
            </CardContent>
          )}

          {onProjectTeam && (
            <CardContent className="space-y-1 w-full px-4">
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
        <Card className="border-0">
          <CardContent className="w-full px-4">
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <Button variant="default" className="w-full" onClick={openUrl}>
                  Share Campaign
                </Button>
              </div>

              {metadata?.parsedLinks &&
                metadata.parsedLinks.map((link, i) => {
                  if (!link.url) return null;
                  return (
                    <div className="w-full" key={i}>
                    <Link href={link.url} target="_blank" className="block w-full">
                      <Button variant="secondary" className="w-full">
                        {link.label}
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
        <Card className="border-0">
          <CardHeader>
            <CardDescription>
              Members of the DAO receiveing funds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
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
