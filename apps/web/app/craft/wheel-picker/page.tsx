import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

import { Example } from "./example";
import styles from "./page.module.css";

export default function Page() {
  return (
    <Article>
      <h1 className={["animate-blur-fade stagger-0", styles.title].join(" ")}>
        Wheel Picker
      </h1>
      <Section>
        <p>
          React component made with{" "}
          <span className={styles.inline}>
            <InlineLinkButton href="https://react-spring.dev/docs">
              @react-spring
            </InlineLinkButton>{" "}
            and{" "}
            <InlineLinkButton href="https://use-gesture.netlify.app/docs/">
              @use-gesture
            </InlineLinkButton>
          </span>
          .
        </p>
        <ul className={styles.copyList}>
          <li>Validation, a11y, and keyboard controls are included.</li>
          <li>
            Compatible&nbsp;with&nbsp;
            <InlineLinkButton href="https://ui.shadcn.com/docs">
              shadcn-ui
            </InlineLinkButton>{" "}
            and{" "}
            <InlineLinkButton href="https://base-ui.com/react/overview/quick-start">
              base-ui
            </InlineLinkButton>
            .
          </li>
        </ul>
        <p>
          Source lives in the{" "}
          <InlineLinkButton href="https://github.com/fedorivanenko/fedor-ivanenko-personal-website/tree/main/packages/wheel-picker">
            GitHub repo
          </InlineLinkButton>
          .
        </p>
      </Section>
      <Section card className={styles.exampleCard}>
        <Example />
        <KbdGroup className={styles.kbdGroup}>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>Esc</Kbd>
        </KbdGroup>
      </Section>
    </Article>
  );
}
