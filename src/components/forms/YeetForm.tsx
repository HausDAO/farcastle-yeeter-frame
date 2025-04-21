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
import { fromWei, nativeCurrencySymbol } from "@/lib/helpers";
import { useChainId, useChains } from "wagmi";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { composeCastUrl, getExplorerUrl } from "@/lib/constants";
import sdk from "@farcaster/frame-sdk";
import { toHex } from "viem";
import { YeeterItem } from "@/lib/types";
import { formatLootForAmount } from "@/lib/yeet-helpers";
import { toBaseUnits } from "@/lib/units";
import { useParams } from "next/navigation";

export type YeetFormProps = {
  confirmed: boolean;
  loading: boolean;
  invalidConnection: boolean;
  formElmClass: string;
  yeeter: YeeterItem;
  handleSubmit: (values: ArbitraryState) => void;
  hash?: string;
  isError: boolean;
};

export const YeetForm = ({
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
  formElmClass,
  hash,
  yeeter,
  isError,
}: YeetFormProps) => {
  const submitButtonText = "Contribute to Campaign";

  const { chainid, yeeterid } = useParams<{
    chainid: string;
    yeeterid: string;
  }>();

  const chainId = useChainId();
  const chains = useChains();
  const activeChain = chains.find((c) => c.id === chainId);

  const formSchema = yup.object().shape({
    message: yup.string(),
    amount: yup
      .number()
      .transform((value, originalValue) => {
        // Treat empty string as undefined for required validation
        return originalValue === "" ? undefined : value;
      })
      .required("amount is a required field")
      .min(
        Number(fromWei(yeeter.minTribute)),
        `amount must be greater than ${fromWei(yeeter.minTribute)}` // Clearer min message
      )
      .typeError("amount must be a number"), // Add specific type error message
  });
  const requiredFields = getRequiredFieldsList(formSchema);

  const form = useForm<yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      message: "",
      amount: 0,
    },
  });

  const onSubmit = (values: yup.InferType<typeof formSchema>) => {
    handleSubmit(values);
  };

  const openUrl = useCallback(() => {
    sdk.actions.openUrl(`${getExplorerUrl(toHex(chainId))}/tx/${hash}`);
  }, [hash, chainId]);

  const openCastUrl = useCallback(() => {
    sdk.actions.openUrl(`${composeCastUrl}/yeeter/${chainid}/${yeeterid}`);
  }, [yeeterid, chainid]);

  const disabled = loading || confirmed || invalidConnection;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={formElmClass}>
        {!confirmed && (
          <>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="How much ETH do you want to contribute?"
                    id="amount"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input
                      id="amount"
                      type="number"
                      placeholder={`${nativeCurrencySymbol(activeChain)}`}
                      disabled={disabled}
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="What excites you about this campaign?"
                    id="message"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="Message"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {!confirmed && (
          <FormActionButtons
            submitButtonText={submitButtonText}
            loading={loading}
            confirmed={confirmed}
            disabled={disabled}
          />
        )}
        {isError && (
          <div className="text-sm text-error flex items-center">Tx Error</div>
        )}
      </form>

      {confirmed && (
        <>
          <div className="font-mulish text-muted text-lg text-center mt-1 uppercase">
            You Received{" "}
            {formatLootForAmount(
              yeeter,
              toBaseUnits(form.getValues("amount").toString())
            )}{" "}
            {Number(
              formatLootForAmount(
                yeeter,
                toBaseUnits(form.getValues("amount").toString())
              )
            ) === 1
              ? "token"
              : "tokens"}
          </div>
          <Button onClick={openCastUrl} className="w-full mb-3">
            Share Contribution
          </Button>

          {hash && (
            <Button onClick={openUrl} className="w-full">
              View Transaction
            </Button>
          )}
        </>
      )}
    </Form>
  );
};
