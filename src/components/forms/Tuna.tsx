"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InfoIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { parseUnits } from "viem";
import { FormComponentProps } from "../app/FormSwitcher";

// adding a new form
// // define tx lego
// // define schema
// // add all field components
// // define value tranformer to send back to parent txPrepper

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
  amount: z.coerce.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
});

export const Tuna = ({
  formConfig,
  handleSubmit,
  loading,
  confirmed,
}: FormComponentProps) => {
  const { submitButtonText } = formConfig;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const preparedValues = {
      ...values,
      amount: parseUnits(values.amount.toString(), 18),
    };
    console.log(values);
    console.log("preparedValues", preparedValues);

    handleSubmit(preparedValues);
  };

  //   const titleWatcher = form.watch("title");
  //   console.log("form", form);
  //   console.log("titleWatcher", titleWatcher);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          disabled={loading || confirmed}
          render={({ field }) => (
            <FormItem>
              <div className="flex mb-2 justify-between">
                <FormLabel>Title</FormLabel>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    some content
                  </PopoverContent>
                </Popover>
              </div>
              <FormControl>
                <Input
                  id="title"
                  placeholder="Simple Input Placeholder"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          disabled={loading || confirmed}
          render={({ field }) => (
            <FormItem>
              <div className="flex mb-2 justify-between">
                <FormLabel>Description</FormLabel>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    some content
                  </PopoverContent>
                </Popover>
              </div>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Add a proposal description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          disabled={loading || confirmed}
          render={({ field }) => (
            <FormItem>
              <div className="flex mb-2 justify-between">
                <FormLabel>Amount</FormLabel>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    some content
                  </PopoverContent>
                </Popover>
              </div>
              <FormControl>
                <Input
                  id="amount"
                  placeholder="Amount"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {loading && (
          <Button type="submit" disabled={loading} className="w-full">
            <Spinner />
          </Button>
        )}
        {!loading && !confirmed && (
          <Button type="submit" className="w-full">
            {submitButtonText || "Create Proposal"}
          </Button>
        )}
        {confirmed && (
          <Button type="submit" disabled={true} className="w-full">
            Success
          </Button>
        )}
      </form>
    </Form>
  );
};
