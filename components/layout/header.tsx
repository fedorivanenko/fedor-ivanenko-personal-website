import Link from "next/link";
import Pulse from "../pulse";

export default function Header() {
  
  return (
    <header className="mr-auto mb-32 top-0">
      <h1 className="font-medium">
        <Link href="/" className="flex space-x-1.5 items-baseline max-w-min">
          <span className="inline-block leading-none whitespace-nowrap">
            Fedor Ivanenko
          </span>
          <Pulse />
        </Link>
      </h1>
      <p className="text-muted-foreground">Design Engineer</p>
    </header>
  );
}
