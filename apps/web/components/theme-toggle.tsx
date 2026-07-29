"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { LaptopIcon, MoonIcon, SunIcon } from "@/components/icons";

import styles from "./theme-toggle.module.css";

interface ThemeOption {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const MiniButton = ({
  label,
  value,
  icon: Icon,
  theme,
  setTheme,
}: ThemeOption & {
  theme: string | undefined;
  setTheme: (v: string) => void;
}) => {
  const checked = theme === value;

  return (
    <span>
      <input
        aria-label={label}
        id={`theme-switch-${value}`}
        type="radio"
        value={value}
        checked={checked}
        onChange={() => setTheme(value)}
        className={styles.srOnly}
      />
      <label
        htmlFor={`theme-switch-${value}`}
        className={[styles.option, checked ? styles.optionActive : ""].join(" ")}
      >
        <span className={styles.srOnly}>{label}</span>
        <Icon className={styles.icon} />
      </label>
    </span>
  );
};

const options = [
  { value: "system", label: "System", icon: LaptopIcon },
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
] satisfies ThemeOption[];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.srOnly}>Select a display theme:</legend>

      {options.map((opt) => (
        <MiniButton key={opt.value} {...opt} theme={theme} setTheme={setTheme} />
      ))}
    </fieldset>
  );
}
