import { InlineLinkButton } from "../ui/button";
import { sectionVariants } from "./section";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer
      className={cn(
        sectionVariants({ animated: true }),
        "w-full max-w-[var(--content-width)] px-2.5 flex-row gap-x-4 sm:gap-x-6 gap-y-2 space-y-0 text-xs text-muted-foreground mt-auto pt-20 md:pt-40 stagger-5 items-baseline flex-wrap "
      )}
    >
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
    </footer>
  );
}
