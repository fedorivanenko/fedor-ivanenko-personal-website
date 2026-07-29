import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";

import s from "./glass-button.module.css";
import styles from "./page.module.css";

export default function PlayGlassButtonPage() {
  return (
    <Article>
      <Section card className={styles.card}>
        <button className={s["glass-button"]} type="button">
          <span data-text="Hello">Hello</span>
        </button>
      </Section>
    </Article>
  );
}
