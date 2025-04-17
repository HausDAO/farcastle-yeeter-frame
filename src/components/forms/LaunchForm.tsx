"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { getRequiredFieldsList } from "@/lib/tx-prepper/form-helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { FormActionButtons } from "../app/FormActionButtons";
import { ArbitraryState } from "@/lib/tx-prepper/prepper-types";
import { ProposalFormLabel } from "../app/ProposalFormLabel";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type LaunchFormProps = {
  confirmed: boolean;
  loading: boolean;
  invalidConnection: boolean;
  formElmClass: string;
  handleSubmit: (values: ArbitraryState) => Promise<void>;
};

const durationOptions = [
  { value: "86400", label: "1 Day" },
  { value: "604800", label: "1 Week" },
  { value: "2628000", label: "1 Month" },
];

const formSchema = yup.object().shape({
  name: yup.string().required(),
  tokenName: yup.string().max(8).required(),
  goal: yup.string().required(),
  duration: yup.string().required(),
});
const requiredFields = getRequiredFieldsList(formSchema);

export const LaunchForm = ({
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
  formElmClass,
}: LaunchFormProps) => {
  const submitButtonText = "Launch Campaign";

  const form = useForm<yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      tokenName: "",
      goal: "",
      duration: "",
    },
  });

  const onSubmit = (values: yup.InferType<typeof formSchema>) => {
    const preparedValues = {
      ...values,
    };
    handleSubmit(preparedValues);
  };

  const disabled = loading || confirmed || invalidConnection;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={formElmClass}>
        <FormField
          control={form.control}
          name="name"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <ProposalFormLabel
                label="What is the name of your campaign?"
                id="name"
                requiredFields={requiredFields}
              />
              <FormControl>
                <Input id="name" placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tokenName"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <ProposalFormLabel
                label="What is the ticker for your campaign?"
                id="name"
                requiredFields={requiredFields}
                popoverContent="The ticker is a short identifier for the token campaign contributors receive. It should be 8 characters or less."
              />
              <FormControl>
                <Input id="tokenName" placeholder="TICKER" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goal"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <ProposalFormLabel
                label="How much ETH do you want to raise?"
                id="goal"
                requiredFields={requiredFields}
              />
              <FormControl>
                <Input
                  id="goal"
                  placeholder="Goal"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          disabled={disabled}
          render={({ field }) => (
            <FormItem className="flex-1">
              <ProposalFormLabel
                label="How long is your campaign?"
                id="duration"
                requiredFields={requiredFields}
              />
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
                <FormControl>
                  <SelectTrigger disabled={disabled}>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card rounded-none">
                  {durationOptions.map((o) => {
                    return (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormActionButtons
          submitButtonText={submitButtonText}
          loading={loading}
          confirmed={confirmed}
          disabled={disabled}
        />
      </form>
    </Form>
  );
};
