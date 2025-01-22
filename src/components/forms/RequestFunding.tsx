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
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { FormComponentProps } from "../app/FormSwitcher";
import { useParams } from "next/navigation";
import { useDao } from "@/hooks/useDao";
import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
  link: z.string().url().optional().or(z.literal("")),
});

export const RequestFunding = ({
  formConfig,
  handleSubmit,
  loading,
  confirmed,
  invalidConnection,
}: FormComponentProps) => {
  const { submitButtonText } = formConfig;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
    },
  });

  const params = useParams<{ chainid: string; daoid: string }>();
  const { dao } = useDao({ chainid: params.chainid, daoid: params.daoid });

  const { tokens } = useDaoTokenBalances({
    chainid: params.chainid,
    safeAddress: dao?.safeAddress,
  });

  console.log("tokens", tokens);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const preparedValues = {
      ...values,
    };
    handleSubmit(preparedValues);
  };

  const disabled = loading || confirmed || invalidConnection;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full px-4 space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <div className="flex mb-2 justify-between">
                <FormLabel>Title</FormLabel>
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
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <div className="flex mb-2 justify-between">
                <FormLabel>Description</FormLabel>
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
          name="link"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <div className="flex mb-2 justify-between">
                <FormLabel>Link</FormLabel>
              </div>
              <FormControl>
                <Input
                  id="link"
                  placeholder="Url for more content"
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
          <Button type="submit" className="w-full" disabled={disabled}>
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
