"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import { FormComponentProps } from "../app/FormSwitcher";
import { FormActionButtons } from "../app/FormActionButtons";
import { ProposalMetaFields } from "../app/ProposalMetaFields";
import { getRequiredFieldsList } from "@/lib/tx-prepper/form-helpers";

const formSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  link: yup.string().url(),
});
const requiredFields = getRequiredFieldsList(formSchema);

export const Signal = ({
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full px-4 space-y-4"
      >
        <ProposalMetaFields
          disabled={disabled}
          requiredFields={requiredFields}
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
