export default function BioPanel() {
  return (
    <section className="flex flex-col w-full ">
      <div className="w-full border-b border-border flex pb-2 mb-2.5">
        <h2 className="mr-auto">Today</h2>
      </div>
      <p className="text-muted-foreground space-y-4 leading-relaxed">
        <span className="sm:inline inline-block">
          I work as a freelance UX designer and React developer. I love to create
          beautifully animated websites and craft UX that feels like magic.
        </span>
        <span className="sm:inline inline-block ml-0 sm:ml-1">
          Believing in the concept of the Renaissance Man, I push myself beyond
          the boundaries of design into engineering, animations, and
          storytelling.
        </span>
      </p>
    </section>
  );
}
