"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { MoonIcon, SunIcon } from "@/components/icons";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="block size-4" aria-hidden="true" />;
  }

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} theme`;

  return (
    <button
      type="button"
      className="flex cursor-pointer items-center justify-center focus-visible:outline-1 focus-visible:outline-offset-2"
      onClick={() => setTheme(nextTheme)}
      aria-label={label}
      title={label}
    >
      {nextTheme === "dark" ? (
        <MoonIcon className="size-4" />
      ) : (
        <SunIcon className="size-4" />
      )}
    </button>
  );
}
