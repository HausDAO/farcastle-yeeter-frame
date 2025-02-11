import { FormConfig } from "@/lib/form-configs";
import { Signal } from "../forms/Signal";
import { SampleForm } from "../forms/SampleForm";
import { ArbitraryState } from "@/lib/tx-prepper/prepper-types";
import { RequestMembership } from "../forms/RequestMembership";
import { RequestFunding } from "../forms/RequestFunding";
// import { RequestMembership } from "../forms/RequestMembership";

export type FormComponentProps = {
  formConfig: FormConfig;
  confirmed: boolean;
  loading: boolean;
  invalidConnection: boolean;
  handleSubmit: (values: ArbitraryState) => Promise<void>;
};

export const FormSwitcher = ({
  formConfig,
  confirmed,
  loading,
  invalidConnection,
  handleSubmit,
}: FormComponentProps) => {
  const renderForm = () => {
    switch (formConfig.id) {
      case "SAMPLE":
        return (
          <SampleForm
            formConfig={formConfig}
            confirmed={confirmed}
            loading={loading}
            invalidConnection={invalidConnection}
            handleSubmit={handleSubmit}
          />
        );
      case "POST_SIGNAL":
        return (
          <Signal
            formConfig={formConfig}
            confirmed={confirmed}
            loading={loading}
            invalidConnection={invalidConnection}
            handleSubmit={handleSubmit}
          />
        );
      case "REQUEST_MEMBERSHIP":
        return (
          <RequestMembership
            formConfig={formConfig}
            confirmed={confirmed}
            loading={loading}
            invalidConnection={invalidConnection}
            handleSubmit={handleSubmit}
          />
        );
      case "REQUEST_FUNDING":
        return (
          <RequestFunding
            formConfig={formConfig}
            confirmed={confirmed}
            loading={loading}
            invalidConnection={invalidConnection}
            handleSubmit={handleSubmit}
          />
        );

      default:
        return null;
    }
  };
  return <>{renderForm()}</>;
};
