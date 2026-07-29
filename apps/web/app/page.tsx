import Image from "next/image";

import { AvailabilityMessage } from "@/components/availability-message";
import { ContactDialog } from "@/components/contact-dialog";
import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";
import { SectionMenu } from "@/components/section-menu";

import alkamindThumbnail from "./project-images/alkamind.webp";
import climaticHealthThumbnail from "./project-images/climatic-health.webp";
import exeterThumbnail from "./project-images/exeter.webp";
import jadeyThumbnail from "./project-images/jadey.webp";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <SectionMenu />
      <Article className={styles.page}>
        <header
          id="top"
          className={[styles.hero, "animate-blur-fade", "stagger-0"].join(" ")}
      >
        <div className={styles.identity}>
          <h1 className={styles.name}>Fedor Studio</h1>
          <h2 className={styles.heroTitle}>E-commerce Design Engineer</h2>
        </div>
        <p>
          I build fast, maintainable Shopify and Next.js / Hydrogen storefronts
          <br className={styles.desktopBreak} /> for design-led brands and
          studios
        </p>
        <div>
          <ContactDialog />
        </div>
        <p className={styles.muted}>Projects typically start at $9,000</p>
      </header>

      <Section id="selected-work" aria-labelledby="selected-work-title">
        <h2 id="selected-work-title" className={styles.title}>
          Selected work
        </h2>
        <div className={styles.entries}>
          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>Alkamind</h3>
            <Image
              className={styles.coverImage}
              src={alkamindThumbnail}
              alt="Alkamind website preview"
              sizes="(max-width: 616px) calc(100vw - 40px), 576px"
            />
            <p className={styles.muted}>Shopify · Full theme rebuild</p>
            <p>
              A complete rebuild and migration of Alkamind&apos;s ecommerce
              storefront to a new custom native Shopify theme
            </p>
            <p>
              My role covered the theme architecture, frontend implementation,
              reusable Shopify sections, and migration of the existing
              storefront
            </p>
            <p className={styles.status}>Completed · Awaiting launch</p>
            <p>
              Design by{" "}
              <InlineLinkButton href="https://wearemostlysunny.com/">
                Mostly Sunny
              </InlineLinkButton>
              <br />
              Delivered in collaboration with{" "}
              <InlineLinkButton href="https://www.hyuman.tech/">
                Hyuman
              </InlineLinkButton>
            </p>
          </article>

          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>Exeter</h3>
            <Image
              className={styles.coverImage}
              src={exeterThumbnail}
              alt="Exeter website preview"
              sizes="(max-width: 616px) calc(100vw - 40px), 576px"
            />
            <p className={styles.muted}>Next.js · Full website rebuild</p>
            <p>
              A complete rebuild of the editorial platform for{" "}
              <em>The Exeter Bulletin</em>, oldest student&apos;s magazine in the
              USA, built with Next.js and Sanity CMS
            </p>
            <p>
              My role covered the editorial section of the website, including
              frontend development, CMS architecture, and Sanity integration
            </p>
            <p className={styles.status}>Completed · Awaiting launch</p>
            <p>
              Design by{" "}
              <InlineLinkButton href="https://cotton.design/">
                Cotton
              </InlineLinkButton>
              <br />
              Delivered in collaboration with{" "}
              <InlineLinkButton href="https://www.hyuman.tech/">
                Hyuman
              </InlineLinkButton>
            </p>
          </article>

          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>
              <InlineLinkButton href="https://www.hellojadey.com/">
                Jadey
              </InlineLinkButton>
            </h3>
            <Image
              className={styles.coverImage}
              src={jadeyThumbnail}
              alt="Jadey website preview"
              sizes="(max-width: 616px) calc(100vw - 40px), 576px"
            />
            <p className={styles.muted}>Next.js · New build</p>
            <p>
              A community platform helping women navigate cancer through
              practical guidance, expert resources, curated products, and
              shared experiences. Built with Next.js, Sanity CMS, and Supabase
            </p>
            <p>
              My role covered the UX and implementation of the authentication
              experience, selected pages, and UI animations
            </p>
            <p className={styles.status}>Live</p>
            <p>
              Design and brand by{" "}
              <InlineLinkButton href="https://wearemostlysunny.com/">
                Mostly Sunny
              </InlineLinkButton>
              <br />
              Delivered in collaboration with{" "}
              <InlineLinkButton href="https://www.hyuman.tech/">
                Hyuman
              </InlineLinkButton>
            </p>
          </article>

          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>
              <InlineLinkButton href="https://www.climatichealth.com/">
                Climatic Health
              </InlineLinkButton>
            </h3>
            <Image
              className={styles.coverImage}
              src={climaticHealthThumbnail}
              alt="Climatic Health website preview"
              sizes="(max-width: 616px) calc(100vw - 40px), 576px"
            />
            <p className={styles.muted}>
              Shopify · Launch and Engineering support
            </p>
            <p>
              Ongoing engineering support for an existing Shopify storefront,
              including theme improvements, feature implementation,
              maintenance, and frontend refinement.
            </p>
            <p className={styles.status}>Live</p>
            <p>
              Original development by{" "}
              <InlineLinkButton href="https://www.linkedin.com/in/chin-yuan-979159130/">
                Chin Yuan
              </InlineLinkButton>
              <br />
              Design by{" "}
              <InlineLinkButton href="https://wearemostlysunny.com/">
                Mostly Sunny
              </InlineLinkButton>
              <br />
              Delivered in collaboration with{" "}
              <InlineLinkButton href="https://www.hyuman.tech/">
                Hyuman
              </InlineLinkButton>
            </p>
          </article>
        </div>
      </Section>

      <Section id="principles" aria-labelledby="principles-title">
        <h2 id="principles-title" className={styles.title}>
          Builds that stay cheap to use and change
        </h2>
        <p>E-commerce storefronts rarely stay finished.</p>
        <p>
          New campaigns, products, markets, integrations, and content requests
          continuously change them. Without a carefully engineered system,
          every new change makes the storefront slower, more fragile, and more
          expensive to maintain.
        </p>
        <p>
          I build storefronts that preserve the original design while keeping
          the machinery inside reliable, maintainable, and easy to extend
        </p>

        <div className={[styles.entries, styles.narrowEntries].join(" ")}>
          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>Design fidelity</h3>
            <p>
              Careful implementation of typography, spacing, responsiveness,
              motion, and interaction details
            </p>
          </article>
          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>Maintainable architecture</h3>
            <p>
              Design systems, reusable components, clear API modules,
              everything that make the storefront easy to understand and
              extend
            </p>
          </article>
          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>Merchant usability</h3>
            <p>
              Clear structure and thoughtfully designed store data make the
              storefront easy for teams to manage and operate
            </p>
          </article>
          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>Robust Solutions</h3>
            <p>
              Efficient, robust, and maintainable technical solutions that keep
              storefronts hard to break and easy to upgrade
            </p>
          </article>
        </div>
      </Section>

      <Section id="background" aria-labelledby="background-title">
        <h2 id="background-title" className={styles.title}>
          Engineering grounded in Design
        </h2>
        <p>
          I started in product design and UX research before moving into
          frontend engineering
        </p>
        <p>
          That background shapes how I build. I care whether an implementation
          preserves the design, supports real content, remains understandable,
          and if it is simply beautiful
        </p>
      </Section>

      <Section id="services" aria-labelledby="services-title">
        <h2 id="services-title" className={styles.title}>
          Ways to work together
        </h2>

        <div className={styles.entries}>
          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>Custom Shopify Storefront</h3>
            <p>
              Native Shopify theme development from completed designs or an
              existing storefront
            </p>
            <p>
              Includes theme architecture, custom sections, responsive
              implementation, interactions, apps integrations, automation,
              accessibility, performance review, QA, and launch support
            </p>
            <p>
              Typical investment: $6,000–$18,000
              <br />
              Typical timeline: 4-8 weeks
            </p>
          </article>

          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>
              Studio and Agency Partnership
            </h3>
            <p>
              Senior Shopify or Next.js / Hydrogen implementation capacity for
              design studios and e-commerce agencies
            </p>
            <p>
              White-label delivery, frontend ownership, overflow development,
              and complete implementation engagements
            </p>
            <p>
              One-time $6,000 per engagement
              <br />
              Subscription $4,000 per month
              <br />
              Hourly $125 per hour
            </p>
          </article>

          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>
              Next.js / Hydrogen Storefront Development
            </h3>
            <p>
              Custom e-commerce frontends for projects that require greater
              flexibility than a standard Shopify theme
            </p>
            <p>
              Includes component architecture, CMS or commerce integration,
              responsive implementation, interactions, performance
              optimization, resource usage optimization, and deployment support
            </p>
            <p>
              Typical investment: $12,000–$24,000
              <br />
              Typical timeline: 6-8 weeks
            </p>
          </article>

          <article className={styles.entry}>
            <h3 className={styles.entryTitle}>
              Focused storefront improvements
            </h3>
            <p>
              Clearly defined work on existing Shopify or Next.js storefronts.
            </p>
            <p>
              Suitable for landing pages, new sections, complex interactions,
              performance improvements, component systems, and architecture
              cleanup
            </p>
            <p>
              Minimum engagement: $3,000
              <br />
              Typical timeline: 3-5 days
            </p>
          </article>
        </div>
      </Section>

      <Section id="nazare" aria-labelledby="nazare-title">
        <h2 id="nazare-title" className={styles.title}>
          Better infrastructure for Shopify themes
        </h2>
        <p>
          I am also building <strong>Nazaré</strong>, a Liquid-first open-source
          toolkit that makes Shopify Themes easier to build, maintain, and
          evolve
        </p>
        <p>
          <InlineLinkButton href="https://nazare.engineering">
            Explore Nazare
          </InlineLinkButton>
        </p>
      </Section>

      <Section id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title" className={styles.title}>
          Have a storefront to build?
        </h2>
        <p>
          Send me your current website, Figma file, or a short description of
          the project.
        </p>
        <p>
          <AvailabilityMessage />
        </p>
        <div>
          <ContactDialog />
        </div>
        <p className={styles.muted}>
          Shopify and Next.js storefront engineering for design-led brands and
          studios.
        </p>
      </Section>
      </Article>
    </>
  );
}
