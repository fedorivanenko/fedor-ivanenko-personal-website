"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { Toaster as Sonner } from "sonner";

import styles from "./sonner.module.css";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={styles.toaster}
      toastOptions={{
        classNames: {
          toast: styles.toast,
          description: styles.description,
          actionButton: styles.actionButton,
          cancelButton: styles.cancelButton,
        },
      }}
      style={
        {
          fontFamily: "inherit",
          "--normal-bg": "var(--dialog-background)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "transparent",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
