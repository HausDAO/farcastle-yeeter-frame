import { ChangeEvent, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FormComponentProps } from "@/lib/types";
import { Button } from "../ui/button";

type FormData = {
  link: string;
  title: string;
  description: string;
};

export const Signal = ({
  isConfirmed,
  formValues,
  validValues,
  setFormValues,
  setValidValues,
}: FormComponentProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({ mode: "onChange" });

  useEffect(() => {
    const hasDescription = formValues.description?.length > 5;
    const hasTitle = formValues.title?.length > 3;

    if (hasDescription && hasTitle) {
      setValidValues(true);
    } else if (validValues) {
      setValidValues(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  console.log("isValid", isValid);
  console.log("errors", errors);
  console.log("isDirty", isDirty);

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <form onSubmit={onSubmit}>
      {!isConfirmed && (
        <>
          <div className="my-3">
            <Input
              className="text-black"
              placeholder="Title"
              id="title"
              {...(register("title"), { minLength: 3, required: true })}
            />
          </div>
          <div className="my-3">
            <Textarea
              placeholder="Description"
              className="h-60 text-black"
              id="description"
              {...(register("description"), { minLength: 3, required: true })}
            />
          </div>
          <div className="my-3">
            <Label>Link</Label>
            <Input
              className="text-black"
              placeholder="Link"
              id="link"
              type="url"
              {...register("link")}
            />
          </div>

          <Button type="submit">SUBMIT</Button>
        </>
      )}
      {isConfirmed && (
        <div className="text-darkPurple text-[50px] font-bold w-full text-center bg-raisinBlack py-2 h-96">
          <p className="pt-24">Success</p>
        </div>
      )}
    </form>
  );
};
