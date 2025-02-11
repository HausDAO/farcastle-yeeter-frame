import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormActionButtons } from "../app/FormActionButtons";
import { FormComponentProps } from "../app/FormSwitcher";
import { ProposalFormLabel } from "../app/ProposalFormLabel";
import { getRequiredFieldsList } from "@/lib/tx-prepper/form-helpers";

const formSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  link: yup.string().url(),
  model: yup.string().min(1),
  choice: yup.string().oneOf(["all", "some", "none"]),
});
const requiredFields = getRequiredFieldsList(formSchema);

export const SampleForm = ({
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
}: FormComponentProps) => {
  const form = useForm<yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      model: "",
    },
  });

  const onSubmit = (values: yup.InferType<typeof formSchema>) => {
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
              <ProposalFormLabel
                label="Input"
                id="title"
                requiredFields={requiredFields}
                popoverContent=" This is the content in the popover."
              />
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
              <ProposalFormLabel
                label="Text Area"
                id="description"
                requiredFields={requiredFields}
                popoverContent=" This is the content in the popover."
              />
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
              <ProposalFormLabel
                label="Select"
                id="model"
                requiredFields={requiredFields}
                popoverContent=" This is the content in the popover."
              />
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
              <ProposalFormLabel
                label="Radio"
                id="choice"
                requiredFields={requiredFields}
                popoverContent=" This is the content in the popover."
              />
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
