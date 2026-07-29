import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";

import styles from "./page.module.css";

export default function Home() {
  return (
    <Article className={styles.page}>
      <header className={[styles.hero, "animate-blur-fade", "stagger-0"].join(" ")}>
        <h1 className={styles.name}>Fedor Ivanenko</h1>
        <p className={styles.role}>Shopify &amp; Next.js Design Engineer</p>
      </header>

      <Section className={styles.section} style={{ ["--stagger" as string]: 1 }}>
        <p className={styles.copy}>
          I&apos;m a Shopify &amp; Next.js Design Engineer. I build websites and
          storefronts. Teams bring me in when craft, performance, and long-term
          maintainability matter.
        </p>
        <p className={styles.copy}>
          I&apos;m building{" "}
          <InlineLinkButton href="https://nazare.engineering">
            nazare.engineering
          </InlineLinkButton>
          , an ambitiously scoped open-source toolkit that makes Shopify Liquid
          themes easy to maintain, extend, and evolve.
        </p>
        <p className={styles.copy}>
          In the near future Nazare will become the foundation layer for
          autonomously evolved, AI-managed storefronts.
        </p>
      </Section>

      <Section
        className={styles.section}
        id="contacts"
        aria-labelledby="contacts-title"
        style={{ ["--stagger" as string]: 2 }}
      >
        <h2 id="contacts-title" className={styles.title}>
          Connect
        </h2>
        <p className={styles.copy}>
          Drop me a message if you want to collaborate or have a project I can
          help with.
        </p>
        <p className={styles.copy}>
          <InlineLinkButton href="mailto:f@nazare.engineering">
            → f@nazare.engineering
          </InlineLinkButton>
        </p>
        <p className={styles.links}>
          <InlineLinkButton href="https://x.com/fedorivanenko_">
            Follow me on X
          </InlineLinkButton>
          <InlineLinkButton href="https://www.linkedin.com/in/fedorivanenko/">
            Connect on LinkedIn
          </InlineLinkButton>
        </p>
      </Section>

      <Section
        className={styles.section}
        id="philosophy"
        aria-labelledby="philosophy-title"
        style={{ ["--stagger" as string]: 3 }}
      >
        <h2 id="philosophy-title" className={styles.title}>
          Philosophy
        </h2>
        <p className={styles.philosophyQuote}>
          <span className={styles.philosophyLead}>— Conscientiousness</span>
          <br />
          is the personality trait of being responsible, careful, or diligent.
          Conscientiousness implies a desire to do a task well, and to take
          obligations to others seriously.
        </p>
        <ul className={styles.philosophyList}>
          <li>○ Paying attention to every detail</li>
          <li>○ Pushing the final 2%</li>
          <li>○ Working as an extension of your team</li>
          <li>○ Building for long-term maintainability</li>
          <li>○ Caring beyond delivery</li>
        </ul>
      </Section>
    </Article>
  );
}
