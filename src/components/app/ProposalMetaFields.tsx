import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ProposalFormLabel } from "./ProposalFormLabel";

export const ProposalMetaFields = ({
  disabled,
  requiredFields,
}: {
  disabled: boolean;
  requiredFields: string[];
}) => {
  const form = useFormContext();
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        disabled={disabled}
        render={({ field }) => (
          <FormItem>
            <ProposalFormLabel
              label="Title"
              id="title"
              requiredFields={requiredFields}
            />
            <FormControl>
              <Input id="title" placeholder="Proposal Title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        disabled={disabled}
        render={({ field }) => (
          <FormItem>
            <ProposalFormLabel
              label="Description"
              id="description"
              requiredFields={requiredFields}
            />
            <FormControl>
              <Textarea
                id="description"
                placeholder="Proposal description"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="link"
        disabled={disabled}
        render={({ field }) => (
          <FormItem>
            <ProposalFormLabel
              label="Link"
              id="link"
              requiredFields={requiredFields}
            />
            <FormControl>
              <Input id="link" placeholder="Url for more content" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
