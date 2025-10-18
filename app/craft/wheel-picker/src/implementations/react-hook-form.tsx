"use client";

import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WheelPicker, WheelPickerHandle, WheelPickerWrapper } from "../wheel-picker";
import { monthOptions } from "./data";
import { formSchema } from "./data";

import * as z from "zod";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="border text-sm w-full py-1 cursor-pointer border-border rounded hover:bg-accent/20 transition-colors" {...props} />;
}

function ReactHookForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: "",
    },
    mode: "onChange",
  });

  const pickerRef = useRef<WheelPickerHandle | null>(null);

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("submitted", data);
  }

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
            // validation state is exposed via fieldState
            invalid={fieldState.invalid}
            className="w-40 h-48 ring-offset-card"
          >
            <WheelPicker
              id={field.name}
              // Note that WheelPicker is intentionally uncontrolled
              // and exposes an imperative API for external control
              //
              // Looping the value through form.state would trigger
              // a form re-render on every update, which can occur
              // as frequently as every 50 ms
              forwardedRef={pickerRef}
              callbackRef={field.ref} // allows RHF to control focus
              options={monthOptions}
              onPick={field.onChange} // updates RHF form state
              onBlur={field.onBlur}
              disabled={field.disabled}
            />
          </WheelPickerWrapper>
        )}
      />
      <div className="flex flex-col space-y-1 w-40">
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </div>
    </form>
  );
}

export { ReactHookForm };
