'use client'

import * as React from 'react'

import { z } from "zod";
import { formSchemaBetterMessages } from "../schemas";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormFieldStatus,
  FormToolTip,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

import { 
    AnimatePresence, 
    motion, 
 } from "motion/react"

export default function FormWithTooltip() {

const [ formData, setFormData] = React.useState<z.infer<typeof formSchemaBetterMessages> | undefined>(undefined)
const [focusedField, setFocusedField] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchemaBetterMessages>>({
    resolver: zodResolver(formSchemaBetterMessages),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchemaBetterMessages>) {
    setFormData(values)
  }

  const resetForm = () => {
      form.reset();
      form.clearErrors();
      setFormData(undefined);
  };

  return (
    <Form {...form}>
      <div className="h-72 flex flex-col justify-center items-center w-full pt-4">
        <AnimatePresence mode="wait">
          {formData !== undefined ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm"
            >
              {formData.firstName} {formData.lastName}
              {" — "}
              {formData.email}
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex space-y-1.5 flex-col mx-auto justify-center w-full max-w-80"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex space-x-1.5">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <div className="relative">
                          <FormToolTip focused={focusedField}
                            defaultMessage={"Please provide your first name"}
                            successMessage={"Thank you!"}
                          />
                          <FormFieldStatus />
                          <Input
                            placeholder="John"
                            {...field}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => {
                              field.onBlur();
                              setFocusedField(null);
                            }}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <div className="relative">
                        <FormToolTip focused={focusedField}
                            defaultMessage={"Please provide your last name"}
                            successMessage={"Thank you!"}
                          />
                          <FormFieldStatus />
                          <Input
                            placeholder="Doe"
                            {...field}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => {
                              field.onBlur();
                              setFocusedField(null);
                            }}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <div className="relative">
                      <FormToolTip focused={focusedField}
                            defaultMessage={"Please provide your email"}
                            successMessage={"Thank you!"}
                          />
                        <FormFieldStatus />
                        <Input
                          placeholder="john@doe.me"
                          {...field}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => {
                            field.onBlur();
                            setFocusedField(null);
                          }}
                          onChange={(e) => {
                            field.onChange(e);
                            form.trigger(field.name);
                          }}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <motion.div layout className="w-full flex">
                <Button
                  variant="secondary"
                  size="sm"
                  type="submit"
                  className="h-9 w-full"
                >
                  Try To See Errors
                </Button>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <Button
        variant="ghost"
        size="tiny"
        type="button"
        className="absolute top-2 right-2.5 flex items-center space-x-1"
        onClick={resetForm}
      >
        <ReloadIcon style={{ width: "12px", height: "12px" }} />
        <span className="text-sm">Reset the form</span>
      </Button>
    </Form>
  );
}