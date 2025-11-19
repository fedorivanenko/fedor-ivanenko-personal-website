import ThemeToggle from "../theme-toggle";
import { InlineLinkButton } from "../ui/button";

export default function Footer() {
  return (
    <footer className="flex flex-col animate-blur-fade mx-auto mt-auto w-full px-5 pb-5 text-xs text-muted-foreground pt-20 md:pt-40 stagger-2 ">
      <div className="max-w-[var(--content-width)] w-full mx-auto flex flex-row flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 items-center">
        <span>{new Date().getFullYear()}</span>
        <span>Talk is cheap, show me your code</span>
        <InlineLinkButton
          className="text-muted-foreground -translate-y-[0.5px]"
          href={
            "https://github.com/fedorivanenko/fedor-ivanenko-personal-website"
          }
        >
          website code
        </InlineLinkButton>
        <ThemeToggle/>
      </div>
    </footer>
  );
}
