import { Section } from "@/components/layout/section";
import { BaseUITest } from "./implementations/base-ui-form";
import { RHFTest } from "./implementations/react-hook-form";
import { TanStackFormTest } from "./implementations/tanstack-form";

export default function Page() {
  return (
    <main>
      <Section className="hidden">
        <BaseUITest />
      </Section>
      <Section className="hidden">
        <RHFTest />
      </Section>
      <Section>
        <TanStackFormTest/>
        </Section>
    </main>
  );
}
