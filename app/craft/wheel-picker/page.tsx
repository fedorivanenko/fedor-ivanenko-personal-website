import { Section } from "@/components/layout/section";
import { RHFTest } from "./src/implementations/react-hook-form";
{/*
  import { BaseUITest } from "./implementations/base-ui-form";
  import { TanStackFormTest } from "./implementations/tanstack-form";
   */}

export default function Page() {
  return (
    <main>
      <Section className="flex flex-row ">
        <RHFTest />
        {/*
        <BaseUITest />
        <TanStackFormTest/>
         */}
      </Section>
    </main>
  );
}
