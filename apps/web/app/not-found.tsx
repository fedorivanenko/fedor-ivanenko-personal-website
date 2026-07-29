import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";

import styles from "./not-found.module.css";

export default function defaultNotFound() {
  return (
    <Article className={styles.container}>
      <Section>
        <h1 className={styles.title}>404</h1>
        <div className={styles.copy}>
          <p>There is no such page</p>
          <p>
            Return to{" "}
            <InlineLinkButton href="/" target="_self">
              index
            </InlineLinkButton>
          </p>
        </div>
      </Section>
    </Article>
  );
}
