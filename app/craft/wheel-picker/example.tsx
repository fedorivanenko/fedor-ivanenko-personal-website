"use client";

import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WheelPicker, WheelPickerHandle, WheelPickerWrapper } from "./src/wheel-picker";
import { monthOptions, formSchema } from "./src/implementations/data";
import { toast } from "sonner"

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="border text-lg sm:text-sm w-full py-1 cursor-pointer border-border rounded hover:bg-accent/20 transition-colors" {...props} />;
}

function Example() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: "",
    },
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("submitted", data);
    const result = monthOptions.find(item => item.value === data.month)?.label
    toast.message(`${result} will come`)
  }

  const pickerRef = React.useRef<WheelPickerHandle | null>(null);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={() => {
        form.reset();
        pickerRef.current?.reset();
      }}
      className="flex flex-col items-center space-y-6 flex-1"
    >
      <Controller
        name="month"
        control={form.control}
        render={({ field, fieldState }) => (
          <WheelPickerWrapper
            invalid={fieldState.invalid}
            className="w-60 sm:w-40 h-64 sm:h-48 ring-offset-card text-xl sm:text-base"
          >
            <label id="label-month" htmlFor="month" className="sr-only">
              Month
            </label>
            <WheelPicker
              id="month"
              forwardedRef={pickerRef}
              callbackRef={field.ref}
              options={monthOptions}
              onPick={field.onChange}
              onBlur={field.onBlur}
              disabled={field.disabled}
            />
          </WheelPickerWrapper>
        )}
      />
      <div className="flex flex-col space-y-1 w-60 sm:w-40">
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </div>
    </form>
  );
}

export { Example };
