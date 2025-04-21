import { useYeets } from "@/hooks/useYeets";
import { YeetMessage } from "./YeetMessage";
import { Card, CardContent } from "@/components/ui/card";

export const YeetMessages = ({
  chainid,
  yeeterid,
}: {
  chainid: string;
  yeeterid: string;
}) => {
  const { yeets } = useYeets({
    chainid,
    yeeterid,
  });

  if (!yeets) return;

  return (
    <Card className="border-0 px-8">
      <CardContent className="p-0 pt-4">
        <div className="text-muted text-sm mb-4 uppercase">Contributors</div>
        {yeets &&
          yeets?.map((yeet) => {
            return <YeetMessage yeet={yeet} key={yeet.id} />;
          })}
      </CardContent>
    </Card>
  );
};
