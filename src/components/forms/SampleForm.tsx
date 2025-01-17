import { FieldWrapper } from '../app/FieldWrapper';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export const SampleForm = () => {
  return (
    <div className="w-full h-full space-y-4 pb-4 px-4">
      <Card className="flex flex-col items-center px-4 pt-4 pb-8 rounded-none">
        <div className="text-muted font-display text-2xl uppercase mb-4">
          View Sample
        </div>

        <div className="w-full space-y-4">
          <FieldWrapper id="simple-input">
            <Input id="simple-input" placeholder="Simple Input Placeholder" />
          </FieldWrapper>

          <FieldWrapper
            id="basic-text-area"
            label="Text Area"
            info={{
              label: 'Info',
              content: 'This is the content in the popover.',
            }}
            error="This is an error message"
          >
            <Textarea id="basic-text-area" placeholder="Placeholder" />
          </FieldWrapper>

          <FieldWrapper
            id="select"
            label="Select"
            info={{
              label: 'Info',
              content: 'This is the content in the popover.',
            }}
            error="This is an error message"
          >
            <Select>
              <SelectTrigger className="rounded-none">
                <SelectValue
                  className="text-muted-foreground"
                  placeholder="Select Model"
                />
              </SelectTrigger>
              <SelectContent className="bg-card rounded-none">
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
              </SelectContent>
            </Select>
          </FieldWrapper>

          <FieldWrapper
            id="radio"
            label="Radio"
            info={{
              label: 'Info',
              content: 'This is the content in the popover.',
            }}
            error="This is an error message"
          >
            <RadioGroup defaultValue="option-one">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Option One</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Option Two</Label>
              </div>
            </RadioGroup>
          </FieldWrapper>
        </div>
      </Card>
    </div>
  );
};
