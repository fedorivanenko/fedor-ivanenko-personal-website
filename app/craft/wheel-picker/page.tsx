import { Section } from "@/components/layout/section";
import { BaseUITest } from "./implementations/base-ui-form";
import { RHFTest } from "./implementations/react-hook-form";

export default function Page() {
  return (
    <main>
        <Section>
        <BaseUITest />
      </Section>
          <Section className="hidden">
        <RHFTest />
      </Section>
    </main>
  );
}
