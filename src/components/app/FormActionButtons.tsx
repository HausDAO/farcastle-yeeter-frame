import { useAccount, useConnect } from "wagmi";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useFrameSDK } from "@/providers/FramesSDKProvider";

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
  const { connect } = useConnect();
  const { connector } = useFrameSDK();

  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Button
        onClick={() => connect({ connector: connector })}
        className="w-full"
        type="button"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <>
      {loading && (
        <Button type="submit" disabled={loading} className="w-full">
          <Spinner />
        </Button>
      )}
      {!loading && !confirmed && (
        <Button type="submit" className="w-full" disabled={disabled}>
          {submitButtonText || "Make Proposal"}
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
