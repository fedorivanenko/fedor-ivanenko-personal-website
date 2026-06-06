import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Example } from "./example";

export default function Page() {
  return (
    <Article>
      <h1 className="heading-xl animate-blur-fade stagger flex scroll-m-20 flex-col">
        Wheel Picker
      </h1>
      <Section>
        <p>
          React component made with{" "}
          <span className="whitespace-nowrap">
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
        <ul className="content space-y-0.5">
          <li className="inline sm:block">
            Validation, a11y, and keyboard controls are included.{" "}
          </li>
          <li className="inline sm:block">
            Compatible&nbsp;with&nbsp;
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
          Install via{" "}
          <code>npx shadcn add https://fedor.studio/r/wheel-picker.json</code>
          <br className="hidden md:block" />
          or get the source from{" "}
          <InlineLinkButton href="https://github.com/fedorivanenko/fedor-ivanenko-personal-website/tree/main/packages/wheel-picker">
            GitHub
          </InlineLinkButton>
          .
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
    </Article>
  );
}
