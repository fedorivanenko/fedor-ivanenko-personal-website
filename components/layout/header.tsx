import Link from "next/link";

export default function Header() {
  return (
    <header className="mr-auto mb-32 top-0">
      <Link href="/">
        <h1>Fedor Ivanenko</h1>
      </Link>
    </header>
  );
}
