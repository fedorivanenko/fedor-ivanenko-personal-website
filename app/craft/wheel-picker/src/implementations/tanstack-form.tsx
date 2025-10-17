"use client";

import { useForm } from "@tanstack/react-form";
import { WheelPicker } from "../wheel-picker";
import { formSchema } from "./data";
import { monthOptions } from "./data";

function TanStackForm() {
  const form = useForm({
    defaultValues: {
      month: "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("submitted:", value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col items-center space-y-6 flex-1"
    >
      <form.Field name="month">
        {(field) => {
          return (
            <div
            // validation state is not exposed but errors are
              data-invalid={field.state.meta.errors.length > 0}
              className="border border-border flex data-[invalid=true]:ring-destructive ring-2 ring-offset-4 ring-offset-background ring-transparent transition-all duration-250 rounded h-48 w-40 gap-1"
            >
              <WheelPicker
                // note, that source of truth is form state
                value={field.state.value}
                options={monthOptions}
                onPick={field.handleChange} // updates form state
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
    </form>
  );
}

export { TanStackForm };
