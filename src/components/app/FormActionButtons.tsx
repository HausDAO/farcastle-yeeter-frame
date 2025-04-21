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
  const { connector } = useFrameSDK();
  const { connect } = useConnect();
  const { isConnected } = useAccount();

  return (
    <>
      {!isConnected && (
        <Button
          onClick={() => connect({ connector: connector })}
          className="w-full"
        >
          Connect Wallet
        </Button>
      )}
      {isConnected && loading && (
        <Button type="submit" disabled={loading} className="w-full">
          <Spinner />
        </Button>
      )}
      {isConnected && !loading && !confirmed && (
        <Button type="submit" className="w-full" disabled={disabled}>
          {submitButtonText || "Make Proposal"}
        </Button>
      )}
      {isConnected && confirmed && (
        <Button type="submit" disabled={true} className="w-full">
          Success
        </Button>
      )}
    </>
  );
};
