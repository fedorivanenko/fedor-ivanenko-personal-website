'use client'

import * as React from 'react'

import { z } from "zod";
import { formSchemaAsyncExample } from "../schemas";

import debounce from 'lodash.debounce'

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

export default function FormAsyncExample() {

const [ formData, setFormData] = React.useState<z.infer<typeof formSchemaAsyncExample> | undefined>(undefined)
const [focusedField, setFocusedField] = React.useState<string | null>(null)

const [formStatus, setFormStatus] = React.useState<
  "processing" | "pass" | undefined
>(undefined);

  const form = useForm<z.infer<typeof formSchemaAsyncExample>>({
    resolver: zodResolver(formSchemaAsyncExample),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchemaAsyncExample>) {
      setFormData(values)
      setFormStatus("processing")
      setTimeout(() => {
          setFormStatus("pass");
        }, 1200);
      }  

  const resetForm = () => {
      form.reset();
      form.clearErrors();
      setFormData(undefined);
  };

  const debouncedFn = React.useRef(
    debounce(async (fieldName: keyof z.infer<typeof formSchemaAsyncExample>) => {
      await form.trigger(fieldName);
    }, 500)
  );
  
  const debouncedTrigger = React.useCallback(
    (fieldName: keyof z.infer<typeof formSchemaAsyncExample>) => {
      debouncedFn.current(fieldName);
    },
    []
  );

  return (
    <Form {...form}>
      <div className="h-72 flex flex-col justify-center items-center w-full pt-4">
        <AnimatePresence mode="wait">
          {formStatus === "pass" && formData !== undefined ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm"
            >
              Hello {formData.email}
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex space-y-1.5 flex-col mx-auto justify-center w-full max-w-80"
              onSubmit={form.handleSubmit(onSubmit)}
            >
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
                            debouncedTrigger(field.name);
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
                    "Try Async Validation Error"
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