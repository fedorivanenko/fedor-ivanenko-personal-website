'use client'

import * as React from 'react'

import {
    Form,
    FormField,
    FormControl,
    FormItem,
    //FormFieldStatus,
    FormToolTip,
    //FormLabel,
  } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { articleNumberInputSchema } from './schemas';

import { ReloadIcon } from "@radix-ui/react-icons";

export default function ArticleNumberInput(){

    const [focusedField, setFocusedField] = React.useState<string | null>(null)

    const form = useForm<z.infer<typeof articleNumberInputSchema>>({
        resolver: zodResolver(articleNumberInputSchema),
        defaultValues: {
            width: "",
            height: ""
        }
    })

    const [velocity, setVelocity] = React.useState(0.1);
    const timeoutRef = React.useRef<NodeJS.Timeout>(undefined);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, value: number) => {
      const step = e.shiftKey ? 1 : velocity;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const newValue = e.key === 'ArrowUp' ? value + step : value - step;
        form.setValue('width', newValue.toFixed(1), { shouldValidate: true });
        
        //TODO: make a normal parabolic easing instead of this trash 
        setVelocity(prev => Math.min(prev * 1.01, 10));
  
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setVelocity(0.1);
        }, 500);
      }
    };

    const resetForm = () => {
        form.reset();
        form.clearErrors();
        //setFormData(undefined);
    };

    return (
      <Form {...form}>
        <div className="h-72 flex flex-col justify-center items-center w-full pt-4">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <FormToolTip
                      focused={focusedField}
                      defaultMessage={
                        "Set the field's width between 2 and 5 feets"
                      }
                      successMessage={"Thank you!"}
                    />
                    <span className="pointer-events-none absolute left-3 h-full py-2 text-sm capitalize">
                      {field.name}
                    </span>
                    <span className="pointer-events-none absolute right-3 h-full py-2 text-sm">
                      ft
                    </span>
                    <Input
                      {...field}
                      onFocus={() => setFocusedField(field.name)}
                      placeholder="2"
                      type="number"
                      step="0.1"
                      inputMode="decimal"
                      className="text-right pr-7 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                      onBlur={() => {
                        field.onBlur();
                        setFocusedField(null);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, parseFloat(field.value || '0'))}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
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
        </div>
      </Form>
    );
}