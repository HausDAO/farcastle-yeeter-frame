"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { getRequiredFieldsList } from "@/lib/tx-prepper/form-helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { FormActionButtons } from "../app/FormActionButtons";
import { ArbitraryState } from "@/lib/tx-prepper/prepper-types";
import { ProposalFormLabel } from "../app/ProposalFormLabel";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { fromWei, nativeCurrencySymbol, toWholeUnits } from "@/lib/helpers";
import { useChainId, useChains } from "wagmi";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { getExplorerUrl } from "@/lib/constants";
import sdk from "@farcaster/frame-sdk";
import { toHex } from "viem";
import { YeeterItem } from "@/lib/types";
import { formatLootForAmount } from "@/lib/yeet-helpers";
import { toBaseUnits } from "@/lib/units";

export type YeetFormProps = {
  confirmed: boolean;
  loading: boolean;
  invalidConnection: boolean;
  formElmClass: string;
  yeeter: YeeterItem;
  handleSubmit: (values: ArbitraryState) => void;
  hash?: string;
};

export const YeetForm = ({
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
  formElmClass,
  hash,
  yeeter,
}: YeetFormProps) => {
  const submitButtonText = "Contribute";

  const chainId = useChainId();
  const chains = useChains();
  const activeChain = chains.find((c) => c.id === chainId);

  const formSchema = yup.object().shape({
    message: yup.string(),
    amount: yup
      .number()
      .required()
      .min(
        Number(fromWei(yeeter.minTribute)),
        `${fromWei(yeeter.minTribute)} minimum contribution`
      ),
  });
  const requiredFields = getRequiredFieldsList(formSchema);

  const form = useForm<yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      message: "",
      amount: 0,
    },
  });

  const amountValue = form.watch("amount");

  const onSubmit = (values: yup.InferType<typeof formSchema>) => {
    const preparedValues = {
      ...values,
    };
    handleSubmit(preparedValues);
  };

  const openUrl = useCallback(() => {
    sdk.actions.openUrl(`${getExplorerUrl(toHex(chainId))}/tx/${hash}`);
  }, [hash, chainId]);

  const disabled = loading || confirmed || invalidConnection;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={formElmClass}>
        {!confirmed && (
          <>
            <FormField
              control={form.control}
              name="amount"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="How much do you want to contribute?"
                    id="name"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input
                      id="amount"
                      placeholder={`Amount in ${nativeCurrencySymbol(activeChain)}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Send a message"
                    id="message"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Textarea id="message" placeholder="Message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormActionButtons
          submitButtonText={submitButtonText}
          loading={loading}
          confirmed={confirmed}
          disabled={disabled}
        />

        {confirmed && (
          <>
            <div className="text-lg font-bold mt-5">
              You got{" "}
              {formatLootForAmount(yeeter, toBaseUnits(amountValue.toString()))}{" "}
              loot tokens!
            </div>
            <Button disabled={true} className="w-full mb-3">
              Share (coming soon)
            </Button>

            {hash && (
              <Button onClick={openUrl} className="w-full">
                View Transaction
              </Button>
            )}
          </>
        )}
      </form>
    </Form>
  );
};
