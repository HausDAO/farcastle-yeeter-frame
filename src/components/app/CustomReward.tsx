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
  rewardLevel1?: string;
  rewardLevel1Details?: string;
  rewardLevel2?: string;
  rewardLevel2Details?: string;
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
      <hr className="mt-4" />
      <h2 className="font-display text-muted text-xl uppercase">
        Custom Reward Level {index}
      </h2>
      <div>
        <FormField
          control={form.control}
          name={`rewardLevel${index}`}
          render={({ field }) => (
            <FormItem>
              <ProposalFormLabel
                label="What is the contribution level for this reward?"
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
      </div>
      <FormField
        control={form.control}
        name={`rewardLevel${index}Details`}
        render={({ field }) => (
          <FormItem>
            <div className="-mt-2">
              <ProposalFormLabel
                label="What is the reward?"
                id={`rewardLevel${index}Details`}
                requiredFields={requiredFields}
              />
            </div>
            <FormControl>
              <Textarea
                id={`rewardLevel${index}Details`}
                placeholder="Reward"
                {...field}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
