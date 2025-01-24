import Link from "next/link";
import Pulse from "../pulse";

export default function Header() {
  
  return (
    <header className="mr-auto mb-32 top-0">
      <Link href="/">
        <h1 className="font-medium space-x-1.5 items-baseline">
          <span className="inline-block leading-none whitespace-nowrap">
            Fedor Ivanenko
          </span>
          <Pulse />
        </h1>
      <p className="text-muted-foreground">Design Engineer</p>
      </Link>
    </header>
  );
}
