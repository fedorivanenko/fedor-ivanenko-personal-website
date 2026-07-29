"use client";

import { RotationWheel } from "@fedor/wheel-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

import { formSchema, monthOptions } from "./data";
import styles from "./example.module.css";

export function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={styles.exampleButton} {...props}>
      <span>{children}</span>
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
    const result = monthOptions.find((item) => item.value === data.month)?.label;
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
      className={styles.form}
    >
      <Controller
        name="month"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className={styles.wheel}>
            <RotationWheel
              options={monthOptions}
              value={field.value}
              onChange={field.onChange}
              error={!!fieldState.error}
            />
          </div>
        )}
      />
      <div className={styles.buttons}>
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </div>
    </form>
  );
}

export { Example };
