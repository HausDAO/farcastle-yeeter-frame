import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export const FormActionButtons = ({
  submitButtonText,
  loading,
  confirmed,
  disabled,
}: {
  submitButtonText?: string;
  loading: boolean;
  confirmed: boolean;
  disabled: boolean;
}) => {
  return (
    <>
      {loading && (
        <Button type="submit" disabled={loading} className="w-full">
          <Spinner />
        </Button>
      )}
      {!loading && !confirmed && (
        <Button type="submit" className="w-full" disabled={disabled}>
          {submitButtonText || "Create Proposal"}
        </Button>
      )}
      {confirmed && (
        <Button type="submit" disabled={true} className="w-full">
          Success
        </Button>
      )}
    </>
  );
};
