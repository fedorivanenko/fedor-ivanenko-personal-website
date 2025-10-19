import Link from "next/link";

export function Header() {
  return (
    <header>
      <div className="absolute flex justify-center items-center top-0 left-2.5 bg-muted pl-2 pr-2 h-6 rounded-md text-muted-foreground text-xs">
        <Link href={"/"} target="_self" className="flex gap-1">
          <span className="block translate-y-0.5">{"↩"}</span> Index
        </Link>
      </div>
    </header>
  );
}
