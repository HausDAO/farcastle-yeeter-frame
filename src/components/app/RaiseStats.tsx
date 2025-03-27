import { toWholeUnits } from "../../lib/helpers";
import { YeeterItem } from "../../lib/types";

export const RaiseStats = ({ yeeter }: { yeeter: YeeterItem }) => {
  if (!yeeter) return;

  return (
    <div className="flex flex-row flex-wrap justify-center gap-10 w-full">
      <div>
        <div className="stat-title">Raised</div>
        <div className="stat-value font-header">
          {Number(toWholeUnits(yeeter?.balance)).toFixed(5)}
        </div>
        <div className="stat-desc">ETH</div>
      </div>
      <div>
        <div className="stat-title">Goal</div>
        <div className="stat-value text-secondary font-header">
          {toWholeUnits(yeeter?.goal)}
        </div>
        <div className="stat-desc text-secondary">ETH</div>
      </div>
    </div>
  );
};
