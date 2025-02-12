import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ProposalFormLabel } from "./ProposalFormLabel";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TokenBalance } from "@/lib/types";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { Button } from "../ui/button";

const TokenItem = ({ token }: { token: TokenBalance }) => {
  const value = token.tokenAddress || "0x0";
  const label = token.token ? token.token.symbol : "ETH";
  return <SelectItem value={value}>{label}</SelectItem>;
};

export const TokenRequestSelect = ({
  disabled,
  tokens,
}: {
  disabled: boolean;
  tokens?: TokenBalance[];
}) => {
  const form = useFormContext();
  const [tokenBalance, setTokenBalance] = useState<string | undefined>();
  const [tokenBalanceText, setTokenBalanceText] = useState<
    string | undefined
  >();

  const selectedTokenAddress = form.watch("tokenAddress");

  useEffect(() => {
    if (selectedTokenAddress) {
      if (selectedTokenAddress === "0x0") {
        const nativeToken = tokens?.find(
          (token) => token.tokenAddress === null
        );
        setTokenBalance(nativeToken?.balance);
        setTokenBalanceText(
          `${formatEther(BigInt(nativeToken?.balance || "0"))} ETH`
        );
      } else {
        const targetToken = tokens?.find(
          (token) => token.tokenAddress === selectedTokenAddress
        );
        setTokenBalance(targetToken?.balance);
        setTokenBalanceText(
          `${formatEther(BigInt(targetToken?.balance || "0"))} ${targetToken?.token?.symbol}`
        );
      }
    }
  }, [selectedTokenAddress, tokens]);

  const handleMax = () => {
    form.setValue("tokenAmount", formatEther(BigInt(tokenBalance || "0")));
  };

  return (
    <div className="mt-3">
      <FormLabel>
        Funding Amount <span className="text-red-500 text-sm ml-1">*</span>
      </FormLabel>
      <div className="flex flex-row gap-2">
        <FormField
          control={form.control}
          name="tokenAmount"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <ProposalFormLabel id="tokenAmount" requiredFields={[]} />
              <FormControl>
                <Input id="tokenAmount" placeholder="Amount" {...field} />
              </FormControl>
              {tokenBalance && (
                <Button size="sm" onClick={handleMax}>
                  Max
                </Button>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tokenAddress"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <ProposalFormLabel id="tokenAddress" requiredFields={[]} />
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Token" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card rounded-none">
                  {tokens &&
                    tokens.map((token, i) => (
                      <TokenItem token={token} key={i} />
                    ))}
                </SelectContent>
              </Select>
              {tokenBalanceText && (
                <p className="text-xs">{tokenBalanceText}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
