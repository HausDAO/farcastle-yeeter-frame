import { FormLabel } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { InfoIcon } from "lucide-react";

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
      <div className="flex mb-2 justify-between">
        <div>
          {label && label}
          {requiredFields.includes(id) && (
            <span className="text-red-500 text-sm ml-1">*</span>
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
