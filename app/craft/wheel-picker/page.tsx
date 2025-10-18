import { Section, sectionVariants } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";
//import { CodeBlock } from "@/components/code-block";
import { Example } from "./example";
import { cn } from "@/lib/utils";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
/*
import { BaseUIForm } from "./src/implementations/base-ui-form";
import { TanStackForm } from "./src/implementations/tanstack-form";
import { ReactHookForm } from "./src/implementations/react-hook-form";
*/

export default function Page() {
  return (
    <main>
      <h1
        className={cn(sectionVariants({ animated: true }), "!space-y-0 mb-12")}
      >
        Wheel Picker
      </h1>
      <Section className="mb-9">
        <p>
          Wheel Picker component made with{" "}
          <InlineLinkButton href="https://react-spring.dev/docs">
            @react-springs
          </InlineLinkButton>{" "}
          and{" "}
          <InlineLinkButton href="https://use-gesture.netlify.app/docs/">
            @use-gesture
          </InlineLinkButton>
          .
        </p>
        <p>
          Validation, a11y, and keyboard control are included.
          <br />
          Compatible with{" "}
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
        </p>
        <p>
          Get the source code from{" "}
          <InlineLinkButton href="https://github.com/fedorivanenko/fedor-ivanenko-personal-website/tree/main/app/craft/wheel-picker/src">
            GitHub
          </InlineLinkButton>
          .{" "}<br />
          npm and CLI installations are coming.
        </p>
      </Section>
      <Section className="flex flex-row mb-9" card>
        <Example />
        <KbdGroup className="absolute bottom-2.5 left-2.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>Esc</Kbd>
        </KbdGroup>
      </Section>
      {/*
        <Section className="flex flex-row mb-9" card>
          <p>BaseUI</p>
          <BaseUIForm />
        </Section>
        <Section className="flex flex-row mb-9" card>
          <p>Tanstack</p>
          <TanStackForm />
        </Section>
        <Section className="flex flex-row mb-9" card>
          <p>RHF</p>
          <ReactHookForm />
        </Section>
       */}
      <Section>
        <p>
          See the implementations for{" "}
          <InlineLinkButton href="https://github.com/fedorivanenko/fedor-ivanenko-personal-website/blob/main/app/craft/wheel-picker/src/implementations/react-hook-form.tsx">
            react-hook-form
          </InlineLinkButton>
          ,{" "}
          <InlineLinkButton href="https://github.com/fedorivanenko/fedor-ivanenko-personal-website/blob/main/app/craft/wheel-picker/src/implementations/tanstack-form.tsx">
            tanstack-form
          </InlineLinkButton>
          , and{" "}
          <InlineLinkButton href="https://github.com/fedorivanenko/fedor-ivanenko-personal-website/blob/main/app/craft/wheel-picker/src/implementations/base-ui-form.tsx">
            base-ui
          </InlineLinkButton>
        </p>
        <p>
          Styling includes both tailwind v4 and css.module versions{' '}<br/>with shadcn/ui{" "}
          <InlineLinkButton href="https://ui.shadcn.com/docs/theming#list-of-variables">
            variables convention.
          </InlineLinkButton>
        </p>
        <p>
          For more details, check the{" "}
          <InlineLinkButton
            href={
              "https://github.com/fedorivanenko/fedor-ivanenko-personal-website/tree/main/app/craft/wheel-picker/src"
            }
          >
            source code
          </InlineLinkButton>.
        </p>
      </Section>

      {/*
      <Section>
        <p>
          The WheelPicker accepts a state management function via the onPick
          prop and&nbsp;dispatches the current value on selection.
        </p>
        <p>
          Note that WheelPicker is intentionally uncontrolled and exposes an
          imperative API for external control. Looping the <code>value</code>{" "}
          through <code>form.state</code> would trigger a form{" "}
          <span data-no-brakes>re-render</span> on every update, which can occur
          as frequently as every 50&nbsp;ms.
        </p>
        <CodeBlock>
          {[
            'import { useForm } from "@tanstack/react-form"',
            "",
            "import {",
            "  WheelPicker,",
            "  WheelPickerOption",
            "  WheelPickerWrapper",
            "  WheelPickerHandle",
            '} from "@/components/wheel-picker";',
            "",
            "const option : WheelPickerOption[] = [",
            '  { value: "JAN", label: "January" },',
            "  ...",
            "];",
            "",
            "export function ExampleForm() {",
            "  const form = useForm({",
            '    defaultValues: { month: "" },',
            "    onSubmit: async ({ value }) => {",
            '      console.log("submitted:", value)',
            "    },",
            "  })",
            "",
            "  const pickerRef = ",
            "    React.useRef<WheelPickerHandle | null>(null);",
            "",
            "  return (",
            "    <form",
            "      onSubmit={(e) => {",
            "        e.preventDefault()",
            "        form.handleSubmit()",
            "      }}",
            "      onReset={() => {",
            "        form.reset();",
            "        pickerRef.current?.reset();",
            "      }}",
            "    >",
            '      <form.Field name="month">',
            "        {(field) => (",
            "          <WheelPickerWrapper",
            "            invalid={field.state.meta.errors.length > 0}",
            "          >",
            "            <WheelPicker",
            "              forwardedRef={pickerRef}",
            "              options={monthOptions}",
            "              onPick={field.handleChange}",
            "            />",
            "          </WheelPickerWrapper>",
            "        )}",
            "      </form.Field>",
            '      <Button type="submit">Submit</Button>',
            '      <Button type="reset">Reset</Button>',
            "    </form>",
            "  )",
            "}",
          ].join("\n")}
        </CodeBlock>
      </Section>
       */}
    </main>
  );
}
