"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormComponentProps } from "../app/FormSwitcher";
import { useParams } from "next/navigation";
import { useDao } from "@/hooks/useDao";
import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances";
import { FormActionButtons } from "../app/FormActionButtons";
import { ProposalMetaFields } from "../app/ProposalMetaFields";
import { Input } from "@/components/ui/input";
import { getRequiredFieldsList } from "@/lib/tx-prepper/form-helpers";
import { ProposalFormLabel } from "../app/ProposalFormLabel";
import { TokenRequestSelect } from "../app/TokenRequestSelect";
import { parseUnits } from "viem";

const formSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  link: yup.string().url(),
  recipient: yup.string().min(42).required(),
  tokenAddress: yup.string().required(),
  tokenAmount: yup.string().required(),
});
const requiredFields = getRequiredFieldsList(formSchema);

export const RequestFunding = ({
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
      link: "",
      recipient: "",
      tokenAmount: "0",
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full px-4 space-y-4"
      >
        <ProposalMetaFields
          disabled={disabled}
          requiredFields={requiredFields}
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
                <Input
                  id="recipient"
                  placeholder="Address to receive funds"
                  {...field}
                />
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
