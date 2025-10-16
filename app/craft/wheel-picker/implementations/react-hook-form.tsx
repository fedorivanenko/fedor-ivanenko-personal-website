"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WheelPicker } from "../component";
import { monthOptions } from "../data";
import { formSchema } from "../data";

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
    console.log(data);
    setData(data.month);
  }

  const handlePick = React.useCallback(
    (value: string) => {
      form.setValue("month", value, { shouldValidate: true });
    },
    [form]
  );

  return (
    <div className="flex gap-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <Controller
          name="month"
          control={form.control}
          render={({ field, fieldState }) => (
            <div
              data-invalid={fieldState.invalid}
              className="flex data-[invalid=true]:ring-destructive ring-2 ring-offset-4 ring-offset-background ring-background transition-all duration-250 rounded h-48 w-40 gap-1"
            >
              <WheelPicker
                callbackRef={field.ref}
                value={field.value}
                options={monthOptions}
                onPick={handlePick}
                disabled={field.disabled}
                onBlur={field.onBlur}
              />
            </div>
          )}
        />
        <button
          type="submit"
          className="mt-4 border border-border rounded hover:bg-accent/20 transition-colors"
        >
          Submit
        </button>
      </form>
      <div>
        {"{"}month:{data}
        {"}"}
      </div>
    </div>
  );
}

export { RHFTest };
