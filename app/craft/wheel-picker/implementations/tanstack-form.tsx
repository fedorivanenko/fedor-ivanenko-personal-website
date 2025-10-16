"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { WheelPicker } from "../component";
import { formSchema } from "../data";
import { monthOptions } from "../data";

function TanStackFormTest() {
  const form = useForm({
    defaultValues: {
      month: "",
    },
    validators: {
        onChange: formSchema,
      },
    onSubmit: async ({ value }) => {
      console.log("submitted:", value);
      setData(value.month);
    },
  });

  const [data, setData] = React.useState<string | null>(null);

  return (
      <form
        onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
        }}
        className="flex flex-col items-center space-y-6 flex-1"
        >
          <h2>TanStack Form</h2>
        <form.Field name="month">
          {(field) => {
            return (
              <div
                data-invalid={field.state.meta.errors.length > 0}
                className="border border-border flex data-[invalid=true]:ring-destructive ring-2 ring-offset-4 ring-offset-background ring-background transition-all duration-250 rounded h-48 w-40 gap-1"
              >
                <WheelPicker
                  value={field.state.value}
                  options={monthOptions}
                  onPick={field.handleChange}
                  onBlur={field.handleBlur}
                />
              </div>
            );
          }}
        </form.Field>
        <button
          type="submit"
          className="w-40 border border-border rounded hover:bg-accent/20 transition-colors"
        >
          Submit
        </button>
      <div>
        {"{"}month:{data}
        {"}"}
      </div>
      </form>
  );
}

export { TanStackFormTest };
