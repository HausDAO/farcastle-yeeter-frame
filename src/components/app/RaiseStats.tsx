import { toWholeUnits } from "../../lib/helpers";
import { YeeterItem } from "../../lib/types";
import { Progress } from "../ui/progress";
import { calcProgressPerc } from "@/lib/yeet-helpers";
import { format } from "date-fns";

const formatRaiseStatsDate = (seconds: string | undefined): string | undefined => {
  if (!seconds) {
    return;
  }
  return format(new Date(Number(seconds) * 1000), "MMMM dd");
};

export const RaiseStats = ({ yeeter }: { yeeter: YeeterItem }) => {
  if (!yeeter) return;

  const perc = calcProgressPerc(yeeter.balance, yeeter.goal);

  return (
    <div className="flex flex-col gap-4 pb-4 w-full">
      <div className="w-full max-w-[300px] mx-auto mt-4">
        <Progress value={perc} className="w-full h-8" />
      </div>
      <div className="flex flex-row w-full mt-2 max-w-[300px] mx-auto">
        <div className="w-1/2">
          <div className="stat-title text-muted text-sm uppercase">Raised</div>
          <div className="stat-value text-lg">
            {Number(toWholeUnits(yeeter?.balance)).toFixed(5)} ETH
          </div>
        </div>
        <div className="w-1/2">
          <div className="stat-title text-muted text-sm uppercase">Goal</div>
          <div className="stat-value text-lg">
            {toWholeUnits(yeeter?.goal)} ETH
          </div>
        </div>
      </div>
      <div className="text-center">
        {yeeter.isEnded && (
          <span className="text-primary text-lg">
            Closed {formatRaiseStatsDate(yeeter.endTime)}
          </span>
        )}
        {yeeter.isComingSoon && (
          <span className="text-primary text-lg">
            Opening {formatRaiseStatsDate(yeeter.startTime)}
          </span>
        )}
        {yeeter.isActive && (
          <span className="text-primary text-lg">
            Closing {formatRaiseStatsDate(yeeter.endTime)}
          </span>
        )}
      </div>
    </div>
  );
};
