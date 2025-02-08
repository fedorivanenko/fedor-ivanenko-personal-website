"use client"

import * as React from "react"

import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

import { Label } from "@/components/ui/label"

import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"

import { motion, MotionProps } from 'motion/react'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-1.5", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { 
    //error, 
    formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(
        //error && "text-destructive", 
        "leading-none",
        className
      )}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{delay:0.025}}
      className="h-4 flex items-center"
    >
      <span
        ref={ref}
        id={formMessageId}
        className={cn("text-[0.8rem] font-medium", className)}
        {...props}
      >
        {body}
      </span>
    </motion.p>
  );
})
FormMessage.displayName = "FormMessage"

const FormToolTip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    MotionProps & {
      focused: string | null;
      defaultMessage: string;
      successMessage: string;
    }
>(({ defaultMessage, successMessage, focused, children, ...props }, ref) => {
  const { error, formMessageId, isDirty, name } = useFormField();
  const errorBody = error ? String(error?.message) : children;

  if (focused !== name) {
    return null;
  }

  const result = !error
    ? isDirty
      ? successMessage
      : defaultMessage
    : errorBody;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      ref={ref}
      id={formMessageId}
      {...props}
      className="absolute -top-1 text-xs w-full flex -translate-y-full pointer-events-none"
    >
      <span className="px-2 py-1 whitespace-nowrap rounded bg-foreground text-background mb-1">
        {result}
      </span>
    </motion.div>
  );
});
FormToolTip.displayName = "FormToolTip";

const fieldStatusVariants = cva(
  "absolute h-full pointer-events-none flex items-center",
  {
    variants: {
      position: {
        left: "left-3",
        right: "right-2",
      },
    },
    defaultVariants: {
      position: "right",
    },
  }
);

export interface FormFieldStatusProps 
  extends React.ComponentProps<typeof motion.div>,
    VariantProps<typeof fieldStatusVariants> {}

const FormFieldStatus = React.forwardRef<HTMLDivElement, FormFieldStatusProps>(
  ({ className, position, ...props }, ref) => {
    const { isDirty, error, formMessageId } = useFormField();
    return (
      <motion.div
        ref={ref}
        id={formMessageId}
        {...props}
        className={cn(fieldStatusVariants({ position }), className)}
      >
        {!error ? (isDirty ? <CheckCircledIcon /> : null ) : <CrossCircledIcon />}
      </motion.div>
    );
  }
);
FormFieldStatus.displayName = "FormFieldStatus";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormFieldStatus,
  FormToolTip,
  FormField,
}
