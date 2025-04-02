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
  const submitButtonText = "Update";

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
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Fundraiser Name"
                    id="name"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input id="name" placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="missionStatement"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Mission Statement"
                    id="missionStatement"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Textarea
                      id="missionStatement"
                      placeholder="Mission Statement"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDetails"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Project Details"
                    id="projectDetails"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Textarea
                      id="projectDetails"
                      placeholder="Project Details"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Project Icon"
                    id="icon"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input id="icon" placeholder="Url for icon" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p>Ensure you input a valid url to an image</p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="custom1Label"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Project Link #1 (label)"
                    id="custom1Label"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input
                      id="custom1Label"
                      placeholder="Label for link #1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="custom1"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Project Link #1 (url)"
                    id="custom1"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input
                      id="custom1"
                      placeholder="Url for Link #1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p>Ensure you input a valid url to an image</p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="custom2Label"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Project Link #2 (label)"
                    id="custom2Label"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input
                      id="custom2Label"
                      placeholder="Label for link #2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="custom2"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Project Link #2 (url)"
                    id="custom2"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input
                      id="custom2"
                      placeholder="Url for Link #2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p>Ensure you input a valid url to an image</p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="custom3Label"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Project Link #3 (label)"
                    id="custom3Label"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input
                      id="custom3Label"
                      placeholder="Label for link #3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="custom3"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <ProposalFormLabel
                    label="Project Link #3 (url)"
                    id="custom3"
                    requiredFields={requiredFields}
                  />
                  <FormControl>
                    <Input
                      id="custom3"
                      placeholder="Url for Link #3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p>Ensure you input a valid url to an image</p>
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

        {isError && (
          <div className="text-sm text-error flex items-center">Tx Error</div>
        )}
      </form>
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
