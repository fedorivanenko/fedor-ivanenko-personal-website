//import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function ContactPanel() {
  return (
    <section className="max-w-full space-y-1.5">
      <h2 className="mr-auto font-medium">Connect</h2>
      <div className="text-muted-foreground">
        Reach me at{" "}
        <Button className="px-0" variant="link" size="inline" asChild>
          <Link href="https://x.com/fedorivanenko_" target="_blank">
            @fedorivanenko_
          </Link>
        </Button>{" "}
        or{" "}
        <Button className="px-0" variant="link" size="inline" asChild>
          <Link 
          href="mailto:f@fedor.studio" 
          target="_blank"
          className="inline-flex"
          //<EnvelopeOpenIcon/>
          >
            f@fedor.studio
          </Link>
        </Button>
      </div>
    </section>
  );
}
