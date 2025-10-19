import Link from "next/link";

export function Header() {
  return (
    <header>
      <Link href={'/'} target="_self">{"<-"} back</Link>
    </header>
  );
}
