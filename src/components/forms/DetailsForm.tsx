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
import { useChainId } from "wagmi";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { getExplorerUrl } from "@/lib/constants";
import sdk from "@farcaster/frame-sdk";
import { toHex } from "viem";
import { YeeterMetadata } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CustomButton } from "../app/CustomButton";

export type DetailsFormProps = {
  confirmed: boolean;
  loading: boolean;
  invalidConnection: boolean;
  formElmClass: string;
  handleSubmit: (values: ArbitraryState) => Promise<void>;
  hash?: string;
  isError: boolean;
  currentProfile?: YeeterMetadata;
};

export const DetailsForm = ({
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
  formElmClass,
  hash,
  isError,
  currentProfile,
}: DetailsFormProps) => {
  const { chainid, yeeterid } = useParams<{
    chainid: string;
    yeeterid: string;
  }>();
  const submitButtonText = "Update Campaign Details";

  const chainId = useChainId();

  const formSchema = yup.object().shape({
    name: yup.string(),
    missionStatement: yup.string(),
    projectDetails: yup.string(),
    icon: yup.string(),
    discord: yup.string(),
    github: yup.string(),
    blog: yup.string(),
    telegram: yup.string(),
    twitter: yup.string(),
    web: yup.string(),
    custom1: yup.string(),
    custom1Label: yup.string(),
    custom2: yup.string(),
    custom2Label: yup.string(),
    custom3: yup.string(),
    custom3Label: yup.string(),
  });
  const requiredFields = getRequiredFieldsList(formSchema);

  const form = useForm<yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: currentProfile?.name || "",
      missionStatement: currentProfile?.missionStatement || "",
      projectDetails: currentProfile?.projectDetails || "",
      icon: currentProfile?.icon || "",
      discord: currentProfile?.parsedLinks?.[0].url || "",
      github: currentProfile?.parsedLinks?.[1].url || "",
      blog: currentProfile?.parsedLinks?.[2].url || "",
      telegram: currentProfile?.parsedLinks?.[3].url || "",
      twitter: currentProfile?.parsedLinks?.[4].url || "",
      web: currentProfile?.parsedLinks?.[5].url || "",
      custom1: currentProfile?.parsedLinks?.[6].url || "",
      custom1Label: currentProfile?.parsedLinks?.[6].label || "",
      custom2: currentProfile?.parsedLinks?.[7].url || "",
      custom2Label: currentProfile?.parsedLinks?.[7].label || "",
      custom3: currentProfile?.parsedLinks?.[8].url || "",
      custom3Label: currentProfile?.parsedLinks?.[8].label || "",
    },
  });

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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="What is the name of your campaign?"
                    id="name"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Name"
                      {...field}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="missionStatement"
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="What is your mission?"
                    id="missionStatement"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Textarea
                      id="missionStatement"
                      placeholder="Mission"
                      {...field}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDetails"
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="What do contributors receive?"
                    id="projectDetails"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Textarea
                      id="projectDetails"
                      placeholder="Description"
                      {...field}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="What image represents your campaign?"
                    id="icon"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input
                      id="icon"
                      placeholder="URL"
                      {...field}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomButton
              index={1}
              form={form}
              disabled={disabled}
              requiredFields={requiredFields}
            />

            <CustomButton
              index={2}
              form={form}
              disabled={disabled}
              requiredFields={requiredFields}
            />

            <CustomButton
              index={3}
              form={form}
              disabled={disabled}
              requiredFields={requiredFields}
            />
          </>
        )}

        <div>
          <FormActionButtons
            submitButtonText={submitButtonText}
            loading={loading}
            confirmed={confirmed}
            disabled={disabled}
          />
        </div>

        {isError && (
          <div className="text-sm text-error flex items-center">Tx Error</div>
        )}
      </form>
      {!confirmed && (
        <Link href={`/yeeter/${chainid}/${yeeterid}`} className="w-full">
          <Button className="w-full mb-3">Cancel</Button>
        </Link>
      )}
      {confirmed && (
        <>
          <Link href={`/yeeter/${chainid}/${yeeterid}`} className="w-full">
            <Button className="w-full mb-3">Back to project</Button>
          </Link>

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
