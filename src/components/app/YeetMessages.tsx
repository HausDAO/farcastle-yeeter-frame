import { useYeets } from "@/hooks/useYeets";
import { YeetMessage } from "./YeetMessage";

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
    <div className="flex flex-col p-3 w-full border-accent text-xs rounded-sm">
      <h4 className="text-primary text-xl">Contributions</h4>
      {yeets &&
        yeets?.map((yeet) => {
          return <YeetMessage yeet={yeet} key={yeet.id} />;
        })}
    </div>
  );
};
