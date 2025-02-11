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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
