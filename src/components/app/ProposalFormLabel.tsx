import { InfoIcon } from "lucide-react";
import { FormLabel } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const ProposalFormLabel = ({
  label,
  id,
  requiredFields,
  popoverContent,
}: {
  label?: string;
  id: string;
  requiredFields: string[];
  popoverContent?: string;
}) => {
  return (
    <FormLabel>
      <div className="flex mb-2 justify-between items-start">
        <div className="text-xl uppercase font-display text-primary leading-none [word-spacing:-0.15em]">
          {label && label}
          {requiredFields.includes(id) && (
            <span className="text-destructive text-sm relative -top-1 ml-0.5 leading-none">
              *
            </span>
          )}
        </div>
        {popoverContent && (
          <Popover>
            <PopoverTrigger>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              {popoverContent}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </FormLabel>
  );
};
