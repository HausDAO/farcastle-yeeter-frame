"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormComponentProps } from "../app/FormSwitcher";
import { useParams } from "next/navigation";
import { useDao } from "@/hooks/useDao";
import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances";
import { FormActionButtons } from "../app/FormActionButtons";
import { ProposalMetaFields } from "../app/ProposalMetaFields";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
  link: z.string().url().optional().or(z.literal("")),
});

export const RequestFunding = ({
  formConfig,
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
}: FormComponentProps) => {
  const { submitButtonText } = formConfig;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
    },
  });

  const params = useParams<{ chainid: string; daoid: string }>();
  const { dao } = useDao({ chainid: params.chainid, daoid: params.daoid });

  const { tokens } = useDaoTokenBalances({
    chainid: params.chainid,
    safeAddress: dao?.safeAddress,
  });

  console.log("tokens", tokens);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const preparedValues = {
      ...values,
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
        <ProposalMetaFields disabled={disabled} />

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
