import { Card } from "@/components/ui/card";
import { DetailsPage } from "./details-page";

export default function Page() {
  return (
    <div className="w-full h-full pb-4 px-4">
      <Card className="flex flex-col items-center pt-4 pb-0 rounded-none">
        <DetailsPage />
      </Card>
    </div>
  );
}
