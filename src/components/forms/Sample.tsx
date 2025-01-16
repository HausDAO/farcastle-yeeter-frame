import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { FieldWrapper } from "../app/FieldWrapper";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

export const Sample = () => {
  return (
    <>
      <FieldWrapper id="simple-input">
        <Input id="simple-input" placeholder="simple input placeholder" />
      </FieldWrapper>

      <FieldWrapper
        id="basic-input"
        label="Basic Input"
        info={{ label: "info", content: "some info content" }}
        error="error message"
      >
        <Input id="basic-input" placeholder="placeholder" />
      </FieldWrapper>

      <FieldWrapper
        id="basic-text-area"
        label="Text Area"
        info={{ label: "info", content: "some info content" }}
        error="error message"
      >
        <Textarea id="basic-text-area" placeholder="placeholder" />
      </FieldWrapper>

      <FieldWrapper
        id="select"
        label="Select"
        info={{ label: "info", content: "some info content" }}
        error="error message"
      >
        <Select>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Choose me" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one">Mavrick</SelectItem>
            <SelectItem value="two">Goose</SelectItem>
            <SelectItem value="three">Iceman</SelectItem>
          </SelectContent>
        </Select>
      </FieldWrapper>

      <FieldWrapper
        id="radio"
        label="Radio"
        info={{ label: "info", content: "some info content" }}
        error="error message"
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
    </>
  );
};
