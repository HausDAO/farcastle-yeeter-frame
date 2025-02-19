"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDao } from "@/hooks/useDao";
import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances";
import {
  getMetaFieldsList,
  getRequiredFieldsList,
} from "@/lib/tx-prepper/form-helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { parseUnits } from "viem";
import * as yup from "yup";
import { FormActionButtons } from "../app/FormActionButtons";
import { FormComponentProps } from "../app/FormSwitcher";
import { ProposalFormLabel } from "../app/ProposalFormLabel";
import { ProposalMetaFields } from "../app/ProposalMetaFields";
import { TokenRequestSelect } from "../app/TokenRequestSelect";

const formSchema = yup.object().shape({
  title: yup.string().required("title is required"),
  description: yup.string(),
  link: yup.string().url(),
  recipient: yup
    .string()
    .min(42, "recipient must be 42 characters")
    .required("recipient is required"),
  tokenAddress: yup.string().required("required"),
  tokenAmount: yup.string().required("required"),
});
const requiredFields = getRequiredFieldsList(formSchema);
const metaFields = getMetaFieldsList(formSchema);

export const RequestFunding = ({
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
      link: "",
      recipient: "",
      tokenAmount: "",
      tokenAddress: "",
    },
  });

  const params = useParams<{ chainid: string; daoid: string }>();
  const { dao } = useDao({ chainid: params.chainid, daoid: params.daoid });

  const { tokens } = useDaoTokenBalances({
    chainid: params.chainid,
    safeAddress: dao?.safeAddress,
  });

  const onSubmit = (values: yup.InferType<typeof formSchema>) => {
    const txKey =
      values.tokenAddress === "0x0" ? "REQUEST_FUNDING_ETH" : "REQUEST_FUNDING";
    const preparedValues = {
      ...values,
      tokenAmount: parseUnits(values.tokenAmount || "0", 18).toString(),
      txKey,
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

        <TokenRequestSelect disabled={disabled} tokens={tokens} />

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
