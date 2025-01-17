import React from 'react';
import { Label } from '../ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { InfoIcon } from 'lucide-react';

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
    <div>
      <div className="flex mb-2 justify-between">
        {label && <Label htmlFor={id}>{label}</Label>}
        {info && (
          <Popover>
            <PopoverTrigger>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              {info.content}
            </PopoverContent>
          </Popover>
        )}
      </div>
      {children}
      {error && <p className="mt-2 text-destructive text-sm">{error}</p>}
    </div>
  );
};
