import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProposalFormLabel } from "./ProposalFormLabel";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface CustomRewardFormData {
  [key: string]: string | undefined;
  rewardLevel1: string;
  rewardLevel1Details: string;
  rewardLevel1Title: string;
  rewardLevel2?: string;
  rewardLevel2Details?: string;
  rewardLevel2Title?: string;
}

type CustomRewardFieldProps = {
  index: number;
  form: UseFormReturn<CustomRewardFormData>;
  disabled: boolean;
  requiredFields: string[];
};

export const CustomReward = ({
  index,
  form,
  disabled,
  requiredFields,
}: CustomRewardFieldProps) => {
  return (
    <>
      <h2 className="font-display text-muted text-xl uppercase">
        Custom Reward Level {index}
      </h2>
      <FormField
        control={form.control}
        name={`rewardLevel${index}Details`}
        render={({ field }) => (
          <FormItem>
            <div>
              <ProposalFormLabel
                label="What will your team give contributors?"
                id={`rewardLevel${index}Details`}
                requiredFields={requiredFields}
              />
            </div>
            <FormControl>
              <Textarea
                id={`rewardLevel${index}Details`}
                placeholder="Reward Description"
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
        name={`rewardLevel${index}Title`}
        render={({ field }) => (
          <FormItem>
            <ProposalFormLabel
              label="What should this reward be called?"
              id={`rewardLevel${index}Title`}
              requiredFields={requiredFields}
            />
            <FormControl>
              <Input
                id={`rewardLevel${index}Title`}
                placeholder="Reward Title"
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
        name={`rewardLevel${index}`}
        render={({ field }) => (
          <FormItem>
            <ProposalFormLabel
              label="How much ETH unlocks this reward?"
              id={`rewardLevel${index}`}
              requiredFields={requiredFields}
            />
            <FormControl>
              <Input
                id={`rewardLevel${index}`}
                placeholder="Reward Level"
                {...field}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {index === 1 && <hr className="mt-4" />}
    </>
  );
};
