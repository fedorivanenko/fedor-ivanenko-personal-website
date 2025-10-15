import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import Link from "next/link"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 xs:whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent hover:bg-input hover:text-accent-foreground",
        secondary:
          "bg-input/75 text-secondary-foreground hover:bg-input/50",
        ghost: "hover:bg-input/50 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 underline decoration-[1px] decoration-secondary-foreground/25 hover:decoration-secondary-foreground/50 transition-all",
      },
      size: {
        default: "h-9 px-4 py-2",
        tiny: "h-6 rounded-md px-2 py-0 text-xs gap-1",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        inline: "inline-block text-[length:inherit] text-[0.96em] tracking-[0.015em]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export interface InlineLinkButtonProps 
  extends Omit<ButtonProps, keyof React.AnchorHTMLAttributes<HTMLAnchorElement> | "asChild">,
    React.ComponentProps<typeof Link> {
}

function InlineLinkButton({ 
  href, 
  target = '_blank',
  children, 
  className,
  ...props 
}: InlineLinkButtonProps) {
  return (
    <Button 
      className={cn(className, "px-0")} 
      variant="link" 
      size="inline" 
      asChild
      >
      <Link 
        href={href}
        target={target}
        {...props}
      >
        {children}
      </Link>
    </Button>
  )
}

export { Button, InlineLinkButton, buttonVariants }
