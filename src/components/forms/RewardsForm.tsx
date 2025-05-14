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
import { Button } from "../ui/button";
import { useCallback } from "react";
import { getExplorerUrl } from "@/lib/constants";
import sdk from "@farcaster/frame-sdk";
import { YeeterMetadata } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CustomReward } from "../app/CustomReward";

export type RewardsFormProps = {
  confirmed: boolean;
  loading: boolean;
  invalidConnection: boolean;
  formElmClass: string;
  handleSubmit: (values: ArbitraryState) => Promise<void>;
  hash?: string;
  isError: boolean;
  currentProfile?: YeeterMetadata;
};

export const RewardsForm = ({
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
  formElmClass,
  hash,
  isError,
  currentProfile,
}: RewardsFormProps) => {
  const { chainid, yeeterid } = useParams<{
    chainid: string;
    yeeterid: string;
  }>();
  const submitButtonText = "Update Rewards";

  const formSchema = yup.object().shape({
    rewardLevel1: yup
      .string()
      .nullable()
      .test(
        "is-positive-number-or-empty",
        "Must be a positive number or empty",
        function (value) {
          if (value === null || value === undefined || value === "") {
            return true;
          }
          const num = Number(value);
          return !isNaN(num) && num > 0;
        }
      ),
    rewardLevel1Details: yup.string(),
    rewardLevel2: yup
      .string()
      .nullable()
      .test(
        "is-positive-number-or-empty",
        "Must be a positive number or empty",
        function (value) {
          // Allow null/empty values
          if (value === null || value === undefined || value === "") {
            return true;
          }

          // Convert to number and verify it's positive
          const num = Number(value);
          return !isNaN(num) && num > 0;
        }
      ),
    rewardLevel2Details: yup.string(),
  });
  const requiredFields = getRequiredFieldsList(formSchema);

  const form = useForm<yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      rewardLevel1: currentProfile?.parsedRewards?.[0].rewardLevel || "",
      rewardLevel1Details: currentProfile?.parsedRewards?.[0].details || "",
      rewardLevel2: currentProfile?.parsedRewards?.[1].rewardLevel || "",
      rewardLevel2Details: currentProfile?.parsedRewards?.[1].details || "",
    },
  });

  const onSubmit = (values: yup.InferType<typeof formSchema>) => {
    const preparedValues = {
      ...values,
    };
    handleSubmit(preparedValues);
  };

  const openUrl = useCallback(() => {
    sdk.actions.openUrl(`${getExplorerUrl(chainid)}/tx/${hash}`);
  }, [hash, chainid]);

  const disabled = loading || confirmed || invalidConnection;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={formElmClass}>
        {!confirmed && (
          <>
            <CustomReward
              index={1}
              form={form}
              disabled={disabled}
              requiredFields={requiredFields}
            />

            <CustomReward
              index={2}
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
          <div className="text-sm text-destructive flex items-center">
            Transaction Error
          </div>
        )}
      </form>
      {!confirmed && (
        <Link href={`/yeeter/${chainid}/${yeeterid}`} className="w-full">
          <Button variant="tertiary" className="w-full mt-2">
            Cancel Rewards Update
          </Button>
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
