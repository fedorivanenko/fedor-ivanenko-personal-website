"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WheelPicker, WheelPickerHandle } from "../wheel-picker";
import { monthOptions } from "./data";
import { formSchema } from "./data";

import * as z from "zod";

function RHFTest() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: "",
    },
    mode: "onChange",
  });

  const [data, setData] = React.useState<string | null>(null);

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log('submitted',data);
    setData(data.month);
  }

  const wheelPickerRef = React.useRef<WheelPickerHandle>(null)

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col items-center space-y-6 flex-1"
    >
      <h2>React Hook Form</h2>
      <Controller
        name="month"
        control={form.control}
        render={({ field, fieldState }) => (
          <div
            data-invalid={fieldState.invalid}
            className="border border-border flex data-[invalid=true]:ring-destructive ring-2 ring-offset-4 ring-offset-background ring-transparent transition-all duration-250 rounded h-48 w-40 gap-1"
          >
            <WheelPicker
              forwardedRef={wheelPickerRef}
              callbackRef={field.ref}
              value={field.value}
              options={monthOptions}
              onPick={field.onChange}
              disabled={field.disabled}
              onBlur={field.onBlur}
            />
          </div>
        )}
      />
      <div className="flex flex-col space-y-1">
        <button
          type="submit"
          className="border w-40 border-border rounded hover:bg-accent/20 transition-colors"
        >
          Submit
        </button>
        <button
          type="reset"
          className="border w-40 border-border rounded hover:bg-accent/20 transition-colors"
          onClick={() => wheelPickerRef.current?.reset()}
        >
          Reset
        </button>
        <button
          type="button"
          className="border w-40 border-border rounded hover:bg-accent/20 transition-colors"
          onClick={() => wheelPickerRef.current?.rotateTo(monthOptions[6])}
        >
          Rotate to June
        </button>
      </div>
      <div>
        {"{"}month:{data}
        {"}"}
      </div>
    </form>
  );
}

export { RHFTest };
