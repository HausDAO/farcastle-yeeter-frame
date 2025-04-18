import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProposalFormLabel } from "./ProposalFormLabel";
import { UseFormReturn } from "react-hook-form";

type CustomButtonFieldProps = {
  index: number;
  form: UseFormReturn<any>;
  disabled: boolean;
  requiredFields: string[];
};

export const CustomButton = ({
  index,
  form,
  disabled,
  requiredFields,
}: CustomButtonFieldProps) => {
  return (
    <>
      <hr className="mt-4" />
      <h2 className="text-base text-muted-foreground font-semibold tracking-tight">
        Custom Button {index}
      </h2>
      <div>
        <FormField
          control={form.control}
          name={`custom${index}Label`}
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <ProposalFormLabel
                label="What should the button say?"
                id={`custom${index}Label`}
                requiredFields={requiredFields}
              />
              <FormControl>
                <Input
                  id={`custom${index}Label`}
                  placeholder="Label"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={`custom${index}`}
        disabled={disabled}
        render={({ field }) => (
          <FormItem>
            <div className="-mt-2">
              <ProposalFormLabel
                label="Where does the button link?"
                id={`custom${index}`}
                requiredFields={requiredFields}
              />
            </div>
            <FormControl>
              <Input
                id={`custom${index}`}
                placeholder="URL"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};