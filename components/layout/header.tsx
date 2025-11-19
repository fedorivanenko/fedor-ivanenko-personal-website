import { cn } from "@/lib/utils";
import Link from "next/link";

import Back from '@/components/icons/back.svg'

export function ReturnButton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute flex justify-center items-center top-0 left-0 lg:left-2.5 h-6 rounded-md text-muted-foreground text-[14px] sm:text-[14px]",
        className
      )}
    >
      <Link href={"/"} target="_self" className="flex gap-1 items-center">
        <Back className="size-3"/> Index
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
