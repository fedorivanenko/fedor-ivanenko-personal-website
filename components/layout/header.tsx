import { cn } from "@/lib/utils";
import Link from "next/link";

export function ReturnButton ({className}:{className?:string}) {

  return (
    <div className={cn("absolute flex justify-center items-center top-0 left-0 lg:left-2.5 bg-muted pl-2 pr-2 h-6 rounded-md text-muted-foreground text-[12px] sm:text-[13px]", className)}>
        <Link href={"/"} target="_self" className="flex gap-1">
          <span className="block translate-y-0.5">{"↩"}</span> Index
        </Link>
      </div>
  )

}

export function Header() {
  return (
    <header>
      <ReturnButton/>
    </header>
  );
}
