"use client";

import { Form } from "@/components/ui/form";
import {
  getMetaFieldsList,
  getRequiredFieldsList,
} from "@/lib/tx-prepper/form-helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { FormActionButtons } from "../app/FormActionButtons";
import { FormComponentProps } from "../app/FormSwitcher";
import { ProposalMetaFields } from "../app/ProposalMetaFields";

const formSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
});
const requiredFields = getRequiredFieldsList(formSchema);
const metaFields = getMetaFieldsList(formSchema);

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
          metaFields={metaFields}
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
