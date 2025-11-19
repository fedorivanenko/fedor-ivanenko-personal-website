import { Section } from "@/components/layout/section";
import s from "./hover.module.css";

export default function PlayHoverRevealPage() {
  return (
    <article>
      <Section card className={s.card}>
        <div className="absolute top-12 left-12">
          <h1>Fedor Ivanenko</h1>
          <p>Design Engineer</p>
        </div>
        <div className={s.inner}>
          <p>
            if you need to build an extremely performant and beautiful website
            with great user experience, and you need it to be <b>built fast</b>.
          </p>
          <p>— I am open for projects as a developer+designer combo</p>
          <a href="/">f@fedor.studio</a>
        </div>
      </Section>
    </article>
  );
}
