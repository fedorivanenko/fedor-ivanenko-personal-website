import { sectionVariants } from "./section";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer
      className={cn(
        sectionVariants({animated: true}),
        "w-full flex-row gap-6 text-sm text-muted-foreground mt-auto pt-20 md:pt-40 stagger-5"
      )}
    >
      <span>{new Date().getFullYear()}</span>
      <span>Talk is cheap, show me your code</span>
    </footer>
  );
}
