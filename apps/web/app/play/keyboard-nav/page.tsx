"use client";

import * as React from "react";

import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";

import styles from "./page.module.css";

export function useDataRegistry() {
  const elements = React.useRef<HTMLElement[]>([]);

  const register = (el: HTMLElement | null) => {
    if (!el) return;
    elements.current.push(el);
  };

  return { elements, register };
}

export default function PlayKeboardNavPage() {
  const { elements, register } = useDataRegistry();

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "}") {
        const first = elements.current[0];
        if (!first) return;

        first.focus();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [elements]);

  return (
    <Article>
      <Section card className={styles.card}>
        {/* biome-ignore lint/a11y/useSemanticElements: Play page needs a focusable static region for keyboard-nav experiment. */}
        <div
          ref={register}
          tabIndex={-1}
          contentEditable="false"
          suppressContentEditableWarning
          onBeforeInput={(e) => e.preventDefault()}
          role="textbox"
          aria-readonly="true"
          aria-multiline="true"
          className={styles.panel}
        >
          <p>Some text to navigate and copy...</p>
          <p>Some text to navigate and copy...</p>
          <button type="button">Heelo?</button>
        </div>
      </Section>
    </Article>
  );
}
