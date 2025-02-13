import { Loader } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <Loader
        className="h-12 w-12 animate-spin text-primary"
        style={{ animationDuration: "3s" }}
      />
    </div>
  );
}
