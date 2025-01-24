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
import Loader from '@/components/ui/loader';

export default function FormWithStatus() {

const [focusedField, setFocusedField] = React.useState<string | null>(null);

const [formStatus, setFormStatus] = React.useState<
  "processing" | "error" | undefined
>(undefined);

  const form = useForm<z.infer<typeof formSchemaBetterMessages>>({
    resolver: zodResolver(formSchemaBetterMessages),
    defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
    },
  });

  const setDefaultData = React.useCallback(() => {
    form.setValue("firstName", "John", { shouldDirty: true });
    form.setValue("lastName", "Doe", { shouldDirty: true });
    form.setValue("email", "john@doe.me", { shouldDirty: true });
   }, [form]);
   
   React.useEffect(() => {
    setDefaultData();
   }, [setDefaultData]);
  

  function onSubmit() {
    setFormStatus("processing")
    setTimeout(() => {
        setFormStatus("error");
      }, 1200);
    }

  const resetForm = () => {
      form.reset();
      form.clearErrors();
      setDefaultData();
      setFormStatus(undefined);
  };

  return (
    <Form {...form}>
      <div className="h-72 flex flex-col justify-center items-center w-full pt-4">
        <AnimatePresence mode="wait">
          {formStatus === "error" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm pb-5 max-w-80 flex flex-col space-y-2 leading-relaxed"
            >
              <p>
                Apologies, but our server was unable to process the registartion
                attempt with the <b>{form.getValues("email")}</b>.
              </p>
              <p>
                Our engineers have already been notified{" "}
                <span className="whitespace-nowrap">
                  and will address this issue.
                </span>
              </p>
              <Button
                size="inline"
                variant="link"
                className="mr-auto pt-3"
                onClick={() => {
                  setFormStatus(undefined);
                }}
              >
                Please try again
              </Button>
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
                          <FormToolTip
                            focused={focusedField}
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
                          <FormToolTip
                            focused={focusedField}
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
                        <FormToolTip
                          focused={focusedField}
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
                  {formStatus === "processing" ? (
                    <span className="flex space-x-1.5 items-center">
                      <Loader />
                      <span>Processing</span>
                    </span>
                  ) : (
                    <span>Try To See Errors</span>
                  )}
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