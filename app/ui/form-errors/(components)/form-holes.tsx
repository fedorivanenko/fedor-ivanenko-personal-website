"use client";

import * as React from "react";

import { z } from "zod";
import { formSchema } from "../schemas";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { AnimatePresence, motion } from "motion/react";

export default function FormHoles() {
  const [formData, setFormData] = React.useState<
    z.infer<typeof formSchema> | undefined
  >(undefined);
  const [reserved, setReserved] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFormData(values);
  }

  const resetForm = () => {
    form.reset();
    form.clearErrors();
    setFormData(undefined);
  };

  return (
    <Form {...form}>
      <div className="h-80 flex flex-col justify-center items-center w-full pt-4">
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
              className="flex flex-col mx-auto justify-center w-full max-w-80 space-y-1.5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex space-x-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <motion.div layout>
                          <Input placeholder="John" {...field} />
                        </motion.div>
                      </FormControl>
                      <div className={`${reserved ? "h-4" : null}`}>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <motion.div layout>
                          <Input placeholder="Doe" {...field} />
                        </motion.div>
                      </FormControl>
                      <div className={`${reserved ? "h-4" : null}`}>
                        <FormMessage />
                      </div>
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
                      <motion.div layout>
                        <Input placeholder="john@doe.me" {...field} />
                      </motion.div>
                    </FormControl>
                    <div className={`${reserved ? "h-4" : null}`}>
                      <FormMessage />
                    </div>
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
      <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
        <Switch
          checked={reserved}
          onCheckedChange={(checked) => setReserved(checked)}
          className="scale-90"
        ></Switch>
        <Label className="text-sm">Reserve space</Label>
      </div>
    </Form>
  );
}
