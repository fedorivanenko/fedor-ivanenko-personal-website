import { Button } from "../ui/button";
import Link from "next/link";

export default function ContactPanel() {
  return (
    <section className="max-w-full">
      <div className="w-full pb-2 mb-1.5 border-b border-border flex">
        <h2 className="mr-auto font-medium">Connect</h2>
      </div>
      <div className="text-muted-foreground">
        Reach me at{" "}
        <Button className="px-0" variant="link">
          <Link href="https://x.com/fedorivanenko_" target="_blank">
          @fedorivanenko_
          </Link>
        </Button>{" "}
        or{" "}
        <Button className="px-0" variant="link">
          <Link href="mailto:f@fedor.studio" target="_blank">
            f@fedor.studio
          </Link>
        </Button>
      </div>
    </section>
  );
}
