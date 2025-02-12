"use client";

import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { type ReactElement } from "react";

export default function LoadingTest(): ReactElement {
  return (
    <div className="w-full h-full space-y-4 p-4">
      <Card className="flex flex-col items-center p-4 space-y-4">
        <h2 className="text-lg font-semibold">Default Loading Spinner</h2>
        <LoadingSpinner />
      </Card>

      <Card className="flex flex-col items-center p-4 space-y-4">
        <h2 className="text-lg font-semibold">DaoList Loading State</h2>
        <div className="w-full max-w-md">
          <div className="font-semibold text-xl text-center">
            Your Chain DAOs
          </div>
          <LoadingSpinner />
        </div>
      </Card>
    </div>
  );
}
