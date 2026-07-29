import styles from "./kbd.module.css";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={[styles.kbd, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kbd-group"
      className={[styles.group, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
