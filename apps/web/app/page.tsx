import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";

export default function Home() {
  return (
    <Article>
      {/* Header */}
      <div className="animate-blur-fade stagger mb-12.5 flex scroll-m-20 flex-col">
        <h1 className="heading-xl">Fedor Ivanenko</h1>
        <p className="text-muted-foreground max-w-min whitespace-nowrap text-base">
          Design Engineer
        </p>
      </div>

      {/* Bio */}
      <Section className="mt-0">
        <p>
          I care about experience, performance, and beauty,{" "}
          <br className="hidden md:block" />
          ship daily, aim for zero technical debt, and pursue simplicity.
        </p>
        <p>
          I build websites using TS, CSS, React, Next.js, Shopify and Sanity
        </p>
        <p>
          Currently in collaboration with{" "}
          <InlineLinkButton href={"https://www.hyuman.tech/"} target="_self">
            hyuman.tech
          </InlineLinkButton>
        </p>
      </Section>

      {/* Blog */}
      <Section id="blog">
        <h2 className="heading-xl">Writing</h2>
        <ul className="gap-7.5 mt-2.5 flex flex-col">
          <li>
            <InlineLinkButton href={"/craft/wheel-picker"} target="_self">
              Intent-Oriented Agentic Coding
            </InlineLinkButton>
            <p className="text-muted-foreground mt-1">
              Pursing stable represenation of the feature in the codebase
            </p>
          </li>
        </ul>
      </Section>

      {/* Craft */}
      <Section id="craft">
        <h2 className="heading-xl">Craft</h2>
        <ul className="gap-7.5 mt-2.5 flex flex-col">
          <li>
            <InlineLinkButton href={"/craft/wheel-picker"} target="_self">
              Nazare
            </InlineLinkButton>
            <p className="text-muted-foreground mt-1">
              Opinionated Shopify Liquid theme and runtime
              <br className="hidden md:block" />
              Made with Tailwind and esbuild
            </p>
          </li>
          <li>
            <InlineLinkButton href={"/craft/wheel-picker"} target="_self">
              Wheel Picker
            </InlineLinkButton>
            <p className="text-muted-foreground mt-1">
              React component
              <br className="hidden md:block" />
              Validation, a11y, and keyboard controls are included
            </p>
          </li>
        </ul>
      </Section>

      {/* Contacts */}
      <Section id="contacts">
        <h2 className="heading-xl">Connect</h2>
        <p>
          Reach me at{" "}
          <InlineLinkButton href="https://x.com/fedorivanenko_">
            @fedorivanenko_
          </InlineLinkButton>{" "}
          <span className="whitespace-nowrap">
            or{" "}
            <InlineLinkButton href="mailto:f@fedor.studio">
              f@fedor.studio
            </InlineLinkButton>
          </span>
        </p>
      </Section>
    </Article>
  );
}
