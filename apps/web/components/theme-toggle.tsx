"use client";

import { useTheme } from "next-themes";
import * as React from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="w-[2.75rem]" aria-hidden="true" />;
  }

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#36ef2a]"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} theme`}
    >
      {nextTheme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
