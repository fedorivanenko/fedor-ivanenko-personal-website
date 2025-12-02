"use client";

import { useTheme } from "next-themes";

import Sun from "@/components/icons/sun.svg";
import Moon from "@/components/icons/moon.svg";
import Laptop from "@/components/icons/laptop.svg";

interface themeOptionInterface {
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
}: themeOptionInterface & {
  theme: string | undefined;
  setTheme: (v: string) => void;
}) => {
  return (
    <span>
      <input
        aria-label={label}
        id={`theme-switch-${value}`}
        type="radio"
        value={value}
        checked={theme === value}
        onChange={() => setTheme(value)}
        className="sr-only peer"
      />
      <label
        htmlFor={`theme-switch-${value}`}
        className="flex cursor-pointer items-center peer-checked:text-foreground"
      >
        <span className="sr-only">{label}</span>
        <Icon className="size-3.5" />
      </label>
    </span>
  );
};

const options = [
  { value: "system", label: "System", icon: Laptop },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] satisfies themeOptionInterface[];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <fieldset className="flex gap-2 ml-auto">
      <legend className="sr-only">Select a display theme:</legend>

      {options.map((opt) => (
        <MiniButton
          key={opt.value}
          {...opt}
          theme={theme}
          setTheme={setTheme}
        />
      ))}
    </fieldset>
  );
}
