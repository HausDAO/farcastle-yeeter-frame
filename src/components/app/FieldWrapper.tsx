import React from "react";
import { Label } from "../ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FieldWrapperProps = {
  children: React.ReactNode;
  id: string;
  label?: string;
  info?: {
    label: string;
    content: string | React.ReactNode;
  };
  error?: string;
};

export const FieldWrapper = ({
  id,
  label,
  info,
  error,
  children,
}: FieldWrapperProps) => {
  return (
    <>
      <div className="my-3 mx-1">
        <div className="flex justify-between">
          {label && <Label htmlFor={id}>{label}</Label>}
          {info && (
            <Popover>
              <PopoverTrigger className="text-sm">{info.label}</PopoverTrigger>
              <PopoverContent>{info.content}</PopoverContent>
            </Popover>
          )}
        </div>
        {children}
        {error && <p className="mt-1 text-red-600 text-xs">{error}</p>}
      </div>
    </>
  );
};
