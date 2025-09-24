import { sectionVariants } from "./section";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer
      className={cn(
        sectionVariants({ variant: "default" }),
        "w-full items-end text-sm text-muted-foreground mt-auto pt-20 md:pt-40"
      )}
    >
      <span>{new Date().getFullYear()}</span>
    </footer>
  );
}
