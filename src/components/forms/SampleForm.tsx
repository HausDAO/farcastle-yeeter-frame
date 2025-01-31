import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormActionButtons } from "../app/FormActionButtons";
import { FormComponentProps } from "../app/FormSwitcher";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Try harder",
  }),
  description: z.string().min(1, {
    message: "Write something",
  }),
  model: z.string().min(1, {
    message: "Make a selection",
  }),
  choice: z.enum(["all", "some", "none"], {
    required_error: "Choose an option",
  }),
});

export const SampleForm = ({
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full px-4 space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <div className="flex mb-2 justify-between">
                <FormLabel>Input</FormLabel>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    This is the content in the popover.
                  </PopoverContent>
                </Popover>
              </div>
              <FormControl>
                <Input id="title" placeholder="Input Placeholder" {...field} />
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
                <FormLabel>Text Area</FormLabel>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    This is the content in the popover.
                  </PopoverContent>
                </Popover>
              </div>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Text Area Placeholder"
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
                <FormLabel>Select</FormLabel>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    This is the content in the popover.
                  </PopoverContent>
                </Popover>
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Placeholder" />
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
                <FormLabel>Radio</FormLabel>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    This is the content in the popover.
                  </PopoverContent>
                </Popover>
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

        <FormActionButtons
          submitButtonText={"Create Proposal"}
          loading={loading}
          confirmed={confirmed}
          disabled={disabled}
        />
      </form>
    </Form>
  );
};
