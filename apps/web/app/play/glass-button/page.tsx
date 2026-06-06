import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";

import s from "./glass-button.module.css";

export default function PlayGlassButtonPage() {
  return (
    <Article>
      <Section
        card
        className="perspective-distant aspect-video items-center justify-center"
      >
        <button className={s["glass-button"]} type="button">
          <span data-text="Hello">Hello</span>
        </button>
      </Section>
    </Article>
  );
}
