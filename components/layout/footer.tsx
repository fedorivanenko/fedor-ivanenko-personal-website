import ThemeToggle from "../theme-toggle";
import { InlineLinkButton } from "../ui/button";

import Scale from "@/components/icons/scale.svg";

export default function Footer() {
  return (
    <footer className="flex flex-col animate-blur-fade mx-auto mt-auto w-full px-5 pb-5 text-xs text-muted-foreground pt-20 md:pt-40 stagger-2 ">
      <div className="max-w-[var(--content-width)] gap-y-2 w-full flex-col mx-auto flex md:flex-row flex-wrap gap-x-2 md:gap-x-4 items-start">
        <span className="inline-flex gap-2">
          <span>{new Date().getFullYear()}</span>
          <span>Talk is cheap, show me your code</span>
        </span>
        <span className="inline-flex gap-x-2 md:gap-x-4 items-center">
          <InlineLinkButton
            className="text-muted-foreground -translate-y-[0.5px]"
            href={
              "https://github.com/fedorivanenko/fedor-ivanenko-personal-website"
            }
          >
            website code
          </InlineLinkButton>
          <InlineLinkButton
            className="text-muted-foreground -translate-y-[0.5px] whitespace-nowrap inline-flex gap-x-1"
            href={
              "https://github.com/fedorivanenko/fedor-ivanenko-personal-website/blob/main/license.md"
            }
          >
            <Scale className="size-4" />{" "}
            MIT
          </InlineLinkButton>
          <ThemeToggle />
        </span>
      </div>
    </footer>
  );
}
