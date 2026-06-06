import { Section, sectionVariants } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <article className="animation-container">
      {/* Header */}
      <div
        className={cn(sectionVariants({ animated: true }), "mb-12 !space-y-0")}
      >
        <h1>Fedor Ivanenko</h1>
        <p className="text-muted-foreground max-w-min whitespace-nowrap text-base">
          Design Engineer
        </p>
      </div>

      {/* Bio */}
      <Section>
        <div className="prose">
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
        </div>
      </Section>

      {/* Blog */}
      <Section id="blog">
        <h2>Blog</h2>
        <ul className="flex flex-col gap-5">
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
        <h2>Craft</h2>
        <ul className="flex flex-col gap-5">
          <li>
            <InlineLinkButton href={"/craft/wheel-picker"} target="_self">
              Nazare
            </InlineLinkButton>
            <p className="text-muted-foreground mt-1">
              Opinionated Shopify Liquid theme and runtime
              <br />
              Made with Tailwind and esbuild.
            </p>
          </li>
          <li>
            <InlineLinkButton href={"/craft/wheel-picker"} target="_self">
              Wheel Picker
            </InlineLinkButton>
            <p className="text-muted-foreground mt-1">
              React component.
              <br />
              Validation, a11y, and keyboard controls are included
            </p>
          </li>
        </ul>
      </Section>

      {/* Contacts */}
      <Section id="contacts">
        <h2>Connect</h2>
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
    </article>
  );
}
