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

  return (
<Card className="border-0 px-8 pt-2">
  <CardContent className="p-0">
    <div className="text-muted text-sm mb-4 uppercase">Contributions</div>
    {yeets &&
        yeets?.map((yeet) => {
          return <YeetMessage yeet={yeet} key={yeet.id} />;
        })}
  </CardContent>
</Card>
  );
};
