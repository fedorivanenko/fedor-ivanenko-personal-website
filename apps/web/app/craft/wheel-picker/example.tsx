"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotationWheel } from "@fedor/wheel-picker";
import { monthOptions, formSchema } from "./data";
import { toast } from "sonner";

export function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="border-border hover:bg-accent/20 grid h-8 w-full cursor-pointer appearance-none place-items-center border p-0 text-sm/none transition-colors"
      {...props}
    >
      <span className="block translate-y-px">{children}</span>
    </button>
  );
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
    const result = monthOptions.find(
      (item) => item.value === data.month
    )?.label;
    toast.message(`${result} will come`);
  }

  function onError() {
    toast.error("Pick a month");
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onError)}
      onReset={() => {
        form.reset();
      }}
      className="flex flex-1 flex-col items-center space-y-6"
    >
      <Controller
        name="month"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="h-54 w-40 text-base">
            <RotationWheel
              options={monthOptions}
              value={field.value}
              onChange={field.onChange}
              error={!!fieldState.error}
            />
          </div>
        )}
      />
      <div className="flex w-40 flex-col space-y-1">
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </div>
    </form>
  );
}

export { Example };
