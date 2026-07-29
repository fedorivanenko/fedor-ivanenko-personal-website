import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";
import * as React from "react";

import styles from "./button.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "tiny" | "sm" | "lg" | "icon" | "inline";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const classes = [
      size === "inline" || variant === "link"
        ? styles.linkButton
        : styles.button,
      size === "inline" ? styles.inline : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <Comp className={classes} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export interface InlineLinkButtonProps
  extends Omit<
      ButtonProps,
      keyof React.AnchorHTMLAttributes<HTMLAnchorElement> | "asChild"
    >,
    React.ComponentProps<typeof Link> {}

function InlineLinkButton({
  href,
  target = "_blank",
  children,
  className,
  ...props
}: InlineLinkButtonProps) {
  return (
    <Button className={className} variant="link" size="inline" asChild>
      <Link href={href} target={target} {...props}>
        {children}
      </Link>
    </Button>
  );
}

export { Button, InlineLinkButton };
