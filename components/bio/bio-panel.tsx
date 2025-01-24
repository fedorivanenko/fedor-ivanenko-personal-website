export default function BioPanel() {
  return (
    <section className="flex flex-col w-full ">
      <div className="w-full border-b border-border flex pb-2 mb-2.5">
        <h2 className="mr-auto">Today</h2>
      </div>
      <p className="text-muted-foreground space-y-4 leading-relaxed">
        <span className="sm:inline inline-block">
          I work as a freelance UX Designer and React developer. I
          love to create beuatifully animated websites and UX that works like
          magic.
        </span>
        <span className="sm:inline inline-block ml-0 sm:ml-1">
          Beliving in the concept of Renessance Man, I&apos;m pushing myself
          beyond the border of design to engineering, animtaions and
          storytelling.
        </span>
      </p>
    </section>
  );
}
