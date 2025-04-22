import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProposalFormLabel } from "./ProposalFormLabel";
import { UseFormReturn } from "react-hook-form";

interface CustomButtonFormData {
  [key: string]: string | undefined;
  custom1?: string;
  custom1Label?: string;
  custom2?: string;
  custom2Label?: string;
  custom3?: string;
  custom3Label?: string;
}

type CustomButtonFieldProps = {
  index: number;
  form: UseFormReturn<CustomButtonFormData>;
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
      <h2 className="text-muted text-sm uppercase">
        Custom Button {index}
      </h2>
      <div>
        <FormField
          control={form.control}
          name={`custom${index}Label`}
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
                  disabled={disabled}
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
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};