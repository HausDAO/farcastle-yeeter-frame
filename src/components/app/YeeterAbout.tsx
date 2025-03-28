import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useYeeter } from "@/hooks/useYeeter";

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

  if (!yeeterid || !chainid || !yeeter) return;

  console.log("metadata", metadata);

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
            <CardTitle>Links</CardTitle>
            <CardDescription>links descript</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">more content</div>
          </CardContent>
          <CardFooter>
            <div className="space-y-1">footer content</div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="team">
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>links descript</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">more content</div>
          </CardContent>
          <CardFooter>
            <div className="space-y-1">footer content</div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
