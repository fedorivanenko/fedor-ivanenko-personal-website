import { Section, sectionVariants } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";
import { Example } from "./example";
import { cn } from "@/lib/utils";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

export default function Page() {
  return (
    <article>
      <h1 className={cn(sectionVariants({ animated: true }))}>Wheel Picker</h1>
      <Section>
        <p>
          React component made with{" "}
          <span data-no-brakes>
            <InlineLinkButton href="https://react-spring.dev/docs">
              @react-springs
            </InlineLinkButton>{" "}
            and{" "}
            <InlineLinkButton href="https://use-gesture.netlify.app/docs/">
              @use-gesture
            </InlineLinkButton>
          </span>
          .
        </p>
        <ul className="space-y-0.5 content">
          <li className="inline sm:block">
            Validation, a11y, and keyboard controls are included.{" "}
          </li>
          <li className="inline sm:block">
            Compatitable&nbsp;with&nbsp;
            <InlineLinkButton href="https://ui.shadcn.com/docs">
              shadcn-ui
            </InlineLinkButton>{" "}
            and{" "}
            <InlineLinkButton
              href={"https://base-ui.com/react/overview/quick-start"}
            >
              base-ui
            </InlineLinkButton>
            .
          </li>
        </ul>
        <p>
          Get the source code from{" "}
          <InlineLinkButton href="https://github.com/fedorivanenko/fedor-ivanenko-personal-website/tree/main/packages/wheel-picker">
            GitHub
          </InlineLinkButton>
          . <br />
          <span data-no-brakes>npm and CLI installations are coming</span>.
        </p>
      </Section>
      <Section card>
        <Example />
        <KbdGroup className="absolute bottom-2.5 left-2.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>Esc</Kbd>
        </KbdGroup>
      </Section>
    </article>
  );
}
