import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ProposalFormLabel } from "./ProposalFormLabel";

type FieldIds = {
  title?: boolean;
  description?: boolean;
  link?: boolean;
};

export const ProposalMetaFields = ({
  disabled,
  requiredFields,
  metaFields,
}: {
  disabled: boolean;
  requiredFields: string[];
  metaFields: FieldIds;
}) => {
  const form = useFormContext();
  return (
    <>
      {metaFields.title && (
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
      )}
      {metaFields.description && (
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
                  placeholder="Proposal Description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {metaFields.link && (
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
                <Input id="link" placeholder="URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};
