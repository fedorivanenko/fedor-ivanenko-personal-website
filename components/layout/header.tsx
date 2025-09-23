import Link from "next/link";

export default function Header() {
  return (
    <header className="mr-auto mb-32 top-0">
      <Link href="/">
        <h1 className="space-x-1.5 items-baseline">Fedor Ivanenko</h1>
        <p role="doc-subtitle">Design Engineer</p>
      </Link>
    </header>
  );
}
