import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useYeeter } from "@/hooks/useYeeter";
import { ProjectTeamList } from "../ProjectTeam";

export const YeeterAbout = ({
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
  const warpcastBaseUrl = `https://warpcast.com/~/compose?text=&embeds[]=https://frames.yeet.haus/yeeter`;

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
        </Card>
      </TabsContent>
      <TabsContent value="links">
        <Card className="border-0">
          <CardHeader>
            <CardDescription>Project links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-3 text-left break-words">
              {chainid !== "0xaa36a7" && (
                <div className="flex flex-row gap-2 items-center">
                  <a href={`${warpcastBaseUrl}/${yeeterid}`} target="_blank">
                    Cast Yeet from Frames ⟶
                  </a>
                </div>
              )}

              {metadata?.parsedLinks &&
                metadata.parsedLinks.map((link, i) => {
                  if (!link.url) return null;
                  return (
                    <a href={link.url} target="_blank" key={i}>
                      {link.label} ⟶
                    </a>
                  );
                })}
              <a
                href={`https://admin.daohaus.club/#/molochv3/${chainid}/${yeeter.dao.id}/safes`}
                target="_blank"
              >
                Project treasury ⟶
              </a>
              <a
                href={`https://admin.daohaus.club/#/molochv3/${chainid}/${yeeter.dao.id}`}
                target="_blank"
              >
                on DAOhaus Admin App ⟶
              </a>
              <a
                href={`https://wee.yeet.haus/#/yeeter/${chainid}/${yeeter.dao.id}`}
                target="_blank"
              >
                on Wee Yeet ⟶
              </a>
            </div>
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
