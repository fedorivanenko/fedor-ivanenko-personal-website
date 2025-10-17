"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WheelPicker } from "./src/wheel-picker";
import { monthOptions, formSchema } from "./src/implementations/data";
import * as z from "zod";

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
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col items-center space-y-6 flex-1"
    >
      <Controller
        name="month"
        control={form.control}
        render={({ field, fieldState }) => (
          <div
            data-invalid={fieldState.invalid}
            className="border border-border flex data-[invalid=true]:ring-destructive ring-2 ring-offset-4 ring-offset-card ring-transparent transition-all duration-250 rounded h-48 w-40 gap-1"
          >
            <WheelPicker
              callbackRef={field.ref}
              value={field.value}
              options={monthOptions}
              onPick={field.onChange}
              onBlur={field.onBlur}
              disabled={field.disabled}
            />
          </div>
        )}
      />
      <button
        type="submit"
        className="border w-40 border-border rounded hover:bg-accent/20 transition-colors"
      >
        Submit
      </button>
    </form>
  );
}

export { Example };
