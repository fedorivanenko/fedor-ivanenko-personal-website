import { sectionVariants } from "./section";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer
      className={cn(
        sectionVariants({animated: false}),
        "w-full flex-row gap-2 text-sm text-muted-foreground mt-auto pt-20 md:pt-40"
      )}
    >
      <span>{new Date().getFullYear()}</span>
      <span>Talk is cheap, show me your code</span>
    </footer>
  );
}
