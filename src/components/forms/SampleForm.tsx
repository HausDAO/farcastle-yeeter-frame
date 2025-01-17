import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { FormComponentProps } from "../app/FormSwitcher";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { InfoIcon } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
  model: z.string({
    required_error: "Please select an model.",
  }),
  choice: z.enum(["all", "some", "none"], {
    required_error: "You need to select a choice.",
  }),
});

export const SampleForm = ({
  formConfig,
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
}: FormComponentProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      model: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const preparedValues = {
      ...values,
    };
    console.log("values", values);
    console.log("preparedValues", preparedValues);
    console.log(handleSubmit);
    // handleSubmit(preparedValues);
  };

  const disabled = loading || confirmed || invalidConnection;
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            disabled={disabled}
            render={({ field }) => (
              <FormItem>
                <div className="flex mb-2 justify-between">
                  <FormLabel>Title</FormLabel>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      some content
                    </PopoverContent>
                  </Popover>
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
            name="model"
            disabled={disabled}
            render={({ field }) => (
              <FormItem>
                <div className="flex mb-2 justify-between">
                  <FormLabel>Model</FormLabel>
                </div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card rounded-none">
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="choice"
            disabled={disabled}
            render={({ field }) => (
              <FormItem>
                <div className="flex mb-2 justify-between">
                  <FormLabel>Radio Choice</FormLabel>
                </div>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="some" id="some" />
                      <Label htmlFor="some">Some</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">None</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loading && (
            <Button type="submit" disabled={loading} className="w-full">
              <Spinner />
            </Button>
          )}
          {!loading && !confirmed && (
            <Button type="submit" className="w-full" disabled={disabled}>
              {formConfig.submitButtonText || "Create Proposal"}
            </Button>
          )}
          {confirmed && (
            <Button type="submit" disabled={true} className="w-full">
              Success
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};
