import { Section } from "@/components/layout/section";
import { SplitText } from "./page.client";

export default function CarftLayoutHookPage() {

  return (
    <article>
      <Section>
        <SplitText>
          Added a standalone package definition plus TS/Vite bundler config so
          layout-hooks builds exactly like the other libraries
        </SplitText>
      </Section>
    </article>
  );
}
