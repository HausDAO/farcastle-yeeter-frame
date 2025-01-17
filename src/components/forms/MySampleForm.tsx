import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  //   FormControl,
  //   FormField,
  //   FormItem,
  //   FormLabel,
  //   FormMessage,
} from '@/components/ui/form';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { FormComponentProps } from '../app/FormSwitcher';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/cn';
// import { Button } from '../ui/button';
// import { Spinner } from '../ui/spinner';
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
// import { InfoIcon } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string(),
  model: z.string({
    required_error: 'Please select an model.',
  }),
  choice: z.enum(['all', 'some', 'none'], {
    required_error: 'You need to select a choice.',
  }),
});

export const MySampleForm = ({
  // formConfig,
  handleSubmit,
  // loading,
  // confirmed,
  // invalidConnection,
}: FormComponentProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      model: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const preparedValues = {
      ...values,
    };
    console.log('values', values);
    console.log('preparedValues', preparedValues);
    console.log(handleSubmit);
    // handleSubmit(preparedValues);
  };

  // const disabled = loading || confirmed || invalidConnection;

  return (
    <div className="w-full h-full space-y-4 pb-4 px-4">
      <Card className="flex flex-col items-center px-4 pt-4 pb-8">
        <div className="text-xl font-display text-primary uppercase mb-4">
          Create Character
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 bg-green-500"
          >
            <div className="w-full space-y-4">
              {/* <Input
                placeholder="Character Name"
                className={cn('w-full rounded-none')}
              /> */}

              {/* <Select>
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent className="bg-card rounded-none">
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};
