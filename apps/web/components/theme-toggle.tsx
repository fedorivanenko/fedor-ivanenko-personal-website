"use client";

import { useTheme } from "next-themes";

import { LaptopIcon, MoonIcon, SunIcon } from "@/components/icons";

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
        className="peer sr-only"
      />
      <label
        htmlFor={`theme-switch-${value}`}
        className="peer-checked:text-foreground flex cursor-pointer items-center"
      >
        <span className="sr-only">{label}</span>
        <Icon className="size-3.5" />
      </label>
    </span>
  );
};

const options = [
  { value: "system", label: "System", icon: LaptopIcon },
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
] satisfies themeOptionInterface[];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <fieldset className="ml-auto flex gap-2">
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
