import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";

export default function defaultNotFound() {
  return (
    <Article className="mb-auto">
      <Section>
        <h1 className="heading-xl">404</h1>
        <div className="text-muted-foreground">
          <p className="!mb-0">There is no such page</p>
          <p>
            Return to{" "}
            <InlineLinkButton href="/" target="_self">
              index
            </InlineLinkButton>
          </p>
        </div>
      </Section>
    </Article>
  );
}
