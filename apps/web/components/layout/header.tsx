import Link from "next/link";

import { BackIcon } from "@/components/icons";

import styles from "./header.module.css";

export function ReturnButton({ className }: { className?: string }) {
  return (
    <div className={[styles.returnShell, className].filter(Boolean).join(" ")}>
      <Link href="/" target="_self" className={styles.returnLink}>
        <BackIcon className={styles.icon} /> Index
      </Link>
    </div>
  );
}

export function Header() {
  return (
    <header className={[styles.header, "animate-blur-fade", "stagger-0"].join(" ")}>
      <ReturnButton />
    </header>
  );
}
