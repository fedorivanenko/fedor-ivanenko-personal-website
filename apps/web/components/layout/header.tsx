import { BackIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function ReturnButton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "text-muted-foreground absolute left-0 top-0 flex h-6 items-center justify-center rounded-md text-xs lg:left-2.5",
        className
      )}
    >
      <Link href={"/"} target="_self" className="flex items-center gap-1">
        <BackIcon className="size-3" /> Index
      </Link>
    </div>
  );
}

export function Header() {
  return (
    <header>
      <ReturnButton />
    </header>
  );
}
