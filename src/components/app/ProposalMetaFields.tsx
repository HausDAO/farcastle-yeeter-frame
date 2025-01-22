import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const ProposalMetaFields = ({ disabled }: { disabled: boolean }) => {
  const form = useFormContext();
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        disabled={disabled}
        render={({ field }) => (
          <FormItem>
            <div className="flex mb-2 justify-between">
              <FormLabel>Title</FormLabel>
            </div>
            <FormControl>
              <Input
                id="title"
                placeholder="Simple Input Placeholder"
                {...field}
              />
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
            <div className="flex mb-2 justify-between">
              <FormLabel>Description</FormLabel>
            </div>
            <FormControl>
              <Textarea
                id="description"
                placeholder="Add a proposal description"
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
            <div className="flex mb-2 justify-between">
              <FormLabel>Link</FormLabel>
            </div>
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
