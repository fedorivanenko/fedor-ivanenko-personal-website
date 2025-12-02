import { Section } from "@/components/layout/section";

import s from "./glass-button.module.css";

export default function PlayGlassButtonPage() {
  return (
    <article>
      <Section card className="aspect-video justify-center items-center perspective-distant">
        <button className={s["glass-button"]}>
          <span data-text="Hello">Hello</span>
        </button>
      </Section>
    </article>
  );
}
