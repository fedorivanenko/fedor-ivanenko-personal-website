import ThemeToggle from "../theme-toggle";
import { InlineLinkButton } from "../ui/button";

export default function Footer() {
  return (
    <footer className="flex flex-col animate-blur-fade mx-auto mt-auto w-full px-5 pb-5 text-muted-foreground pt-20 md:pt-40 stagger-2">
      <div className="max-w-[var(--content-width)] gap-y-0 w-full flex flex-col mx-auto justify-baseline">
        <span className="inline-flex gap-2 ">
          <span>{new Date().getFullYear()}</span>
          <span>Talk is cheap, show me your code</span>
        </span>
        <span className="w-full flex gap-x-2 text-[14px]">
          <InlineLinkButton
            className="text-muted-foreground"
            href={
              "https://github.com/fedorivanenko/fedor-ivanenko-personal-website"
            }
          >
            Website Code
          </InlineLinkButton>
          <InlineLinkButton
            className="text-muted-foreground whitespace-nowrap gap-x-1"
            href={
              "https://github.com/fedorivanenko/fedor-ivanenko-personal-website/blob/main/license.md"
            }
          >
            MIT
          </InlineLinkButton>
          <ThemeToggle />
        </span>
      </div>
    </footer>
  );
}
