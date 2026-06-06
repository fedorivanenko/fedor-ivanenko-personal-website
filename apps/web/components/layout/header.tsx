import { BackIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function ReturnButton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "text-muted-foreground sticky left-0 top-5 flex h-6 w-full items-start justify-start rounded-md text-xs lg:left-2.5",
        className
      )}
    >
      <Link href={"/"} target="_self" className="flex items-center gap-1">
        <BackIcon className="size-3 -translate-y-0.5" /> Index
      </Link>
    </div>
  );
}

export function Header() {
  return (
    <header className="animate-blur-fade stagger-0 mx-auto mb-16 w-full max-w-[var(--content-width)] translate-y-0.5 px-2.5 lg:mx-0 lg:w-auto lg:px-0">
      <ReturnButton />
    </header>
  );
}
