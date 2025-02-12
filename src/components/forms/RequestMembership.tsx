"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormComponentProps } from "../app/FormSwitcher";
import { parseUnits } from "viem";
import { FormActionButtons } from "../app/FormActionButtons";
import { ProposalMetaFields } from "../app/ProposalMetaFields";
import {
  getMetaFieldsList,
  getRequiredFieldsList,
} from "@/lib/tx-prepper/form-helpers";
import { ProposalFormLabel } from "../app/ProposalFormLabel";

const formSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  sharesRequested: yup.string().required(),
  lootRequested: yup.string().required(),
  recipient: yup.string().min(42).required(),
});
const requiredFields = getRequiredFieldsList(formSchema);
const metaFields = getMetaFieldsList(formSchema);

export const RequestMembership = ({
  formConfig,
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
}: FormComponentProps) => {
  const { submitButtonText } = formConfig;
  const form = useForm<yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      sharesRequested: "0",
      lootRequested: "0",
      recipient: "",
    },
  });

  const onSubmit = (values: yup.InferType<typeof formSchema>) => {
    const preparedValues = {
      ...values,
      sharesRequested: parseUnits(values.sharesRequested || "0", 18).toString(),
      lootRequested: parseUnits(values.lootRequested || "0", 18).toString(),
    };
    handleSubmit(preparedValues);
  };

  const disabled = loading || confirmed || invalidConnection;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full px-4 space-y-4"
      >
        <ProposalMetaFields
          disabled={disabled}
          requiredFields={requiredFields}
          metaFields={metaFields}
        />

        <FormField
          control={form.control}
          name="recipient"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <ProposalFormLabel
                label="Recipient"
                id="recipient"
                requiredFields={requiredFields}
              />
              <FormControl>
                <Input id="recipient" placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sharesRequested"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <ProposalFormLabel
                label="Voting Tokens"
                id="sharesRequested"
                requiredFields={requiredFields}
              />
              <FormControl>
                <Input id="sharesRequested" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lootRequested"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <ProposalFormLabel
                label="Non-Voting Tokens"
                id="lootRequested"
                requiredFields={requiredFields}
              />
              <FormControl>
                <Input id="lootRequested" {...field} />
              </FormControl>
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
