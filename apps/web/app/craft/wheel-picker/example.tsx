"use client";

import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotationWheel } from "@fedor/wheel-picker";
import { monthOptions, formSchema } from "./data";
import { toast } from "sonner"

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="border text-sm w-full py-1 cursor-pointer border-border hover:bg-accent/20 transition-colors" {...props} />;
}

function Example() {
  const [resetKey, setResetKey] = React.useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: "",
    },
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const result = monthOptions.find(item => item.value === data.month)?.label
    toast.message(`${result} will come`)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={() => {
        form.reset();
        setResetKey(k => k + 1);
      }}
      className="flex flex-col items-center space-y-6 flex-1"
    >
      <Controller
        name="month"
        control={form.control}
        render={({ field }) => (
          <div className="w-40 h-54 text-base">
            <RotationWheel
              key={resetKey}
              options={monthOptions}
              onPick={field.onChange}
            />
          </div>
        )}
      />
      <div className="flex flex-col space-y-1 w-40">
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </div>
    </form>
  );
}

export { Example };
