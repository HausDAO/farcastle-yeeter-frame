"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  getMetaFieldsList,
  getRequiredFieldsList,
} from "@/lib/tx-prepper/form-helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { parseUnits } from "viem";
import * as yup from "yup";
import { FormActionButtons } from "../app/FormActionButtons";
import { FormComponentProps } from "../app/FormSwitcher";
import { ProposalFormLabel } from "../app/ProposalFormLabel";
import { ProposalMetaFields } from "../app/ProposalMetaFields";

const formSchema = yup.object().shape({
  title: yup.string().required("title is required"),
  description: yup.string(),
  sharesRequested: yup.string().required("voting tokens are required"),
  lootRequested: yup.string().required("non-voting tokens are required"),
  recipient: yup
    .string()
    .min(42, "recipient must be 42 characters")
    .required("recipient is required"),
});
const requiredFields = getRequiredFieldsList(formSchema);
const metaFields = getMetaFieldsList(formSchema);

export const RequestMembership = ({
  formConfig,
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
  formElmClass,
}: FormComponentProps) => {
  const { submitButtonText } = formConfig;
  const form = useForm<yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      sharesRequested: "",
      lootRequested: "",
      recipient: "",
    },
  });

  console.log("Form errors:", form.formState.errors);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className={formElmClass}>
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
                <Input id="sharesRequested" placeholder="0" {...field} />
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
                <Input id="lootRequested" placeholder="0" {...field} />
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
