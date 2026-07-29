import { InlineLinkButton } from "../ui/button";

import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={[styles.footer, "animate-blur-fade", "stagger-2"].join(" ")}>
      <div className={styles.inner}>
        <span className={styles.line}>
          <span>{new Date().getFullYear()}</span>
          <span>Talk is cheap, show me your code</span>
        </span>
        <span className={styles.links}>
          <InlineLinkButton
            className={styles.mutedLink}
            href="https://github.com/fedorivanenko/fedor-ivanenko-personal-website"
          >
            Website Code
          </InlineLinkButton>
          <InlineLinkButton
            className={styles.mutedLink}
            href="https://github.com/fedorivanenko/fedor-ivanenko-personal-website/blob/main/license.md"
          >
            MIT
          </InlineLinkButton>
        </span>
      </div>
    </footer>
  );
}
