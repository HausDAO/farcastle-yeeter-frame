import { Dispatch } from "react";
import { FormValues } from "@/lib/form-configs";
import { Signal } from "../forms/Signal";
import { Sample } from "../forms/Sample";
// import { RequestMembership } from "../forms/RequestMembership";

export const FormSwitcher = ({
  formid,
  isConfirmed,
  formValues,
  validValues,
  setFormValues,
  setValidValues,
}: {
  formid: string;
  isConfirmed: boolean;
  formValues: FormValues;
  validValues: boolean;
  setFormValues: Dispatch<FormValues>;
  setValidValues: Dispatch<boolean>;
}) => {
  const renderForm = () => {
    switch (formid) {
      case "SAMPLE":
        return <Sample />;
      case "POST_SIGNAL":
        return (
          <Signal
            isConfirmed={isConfirmed}
            formValues={formValues}
            validValues={validValues}
            setFormValues={setFormValues}
            setValidValues={setValidValues}
          />
        );
      // case "REQUEST_MEMBERSHIP":
      //   return (
      //     <RequestMembership
      //       isConfirmed={isConfirmed}
      //       formValues={formValues}
      //       validValues={validValues}
      //       setFormValues={setFormValues}
      //       setValidValues={setValidValues}
      //     />
      //   );

      default:
        return null;
    }
  };
  return <>{renderForm()}</>;
};
