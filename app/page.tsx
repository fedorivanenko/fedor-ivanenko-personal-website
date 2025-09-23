import { InlineLinkButton } from "@/components/ui/button";

export function BioPanel() {
  return (
    <section className="flex flex-col w-full space-y-1.5">
      <p className="space-y-4 leading-relaxed">
        <span className="sm:inline inline-block">
          I work as a freelance UX designer and React developer. I love to create
          beautifully animated websites and craft UX that feels like magic.
        </span>
      </p>
    </section>
  );
}

export function ContactPanel() {
  return (
    <section className="max-w-full space-y-1.5">
      <h2 className="mr-auto font-medium">Connect</h2>
      <p>
      Reach me at{" "}
      <InlineLinkButton href="https://x.com/fedorivanenko_">
        @fedorivanenko_
      </InlineLinkButton>{" "}
      and{" "}
      <InlineLinkButton href="mailto:f@fedor.studio">
        f@fedor.studio
      </InlineLinkButton>
      {" "}or check my{" "}
      <InlineLinkButton href="https://github.com/fedorivanenko">
        github
      </InlineLinkButton>
    </p>
    </section>
  );
}


export default function Home() {
  return (
    <main className="w-full space-y-32 pb-32">
      <BioPanel />
      <ContactPanel />
    </main>
  );
}
