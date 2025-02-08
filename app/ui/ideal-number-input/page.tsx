import ArticleNumberInput from "./(components)/article-number-input";

export default function Page() {
  return (
    <main>
      <article className="mb-32 flex flex-col space-y-20">
        <section className="flex flex-col space-y-8 text-secondary-foreground leading-relaxed">
          <h1 className="font-medium capitalize">Ideal Number Input</h1>
          <p>Number input</p>
          <div className="w-[calc(100%+1.25rem)] flex flex-col space-y-4">
            <div className="w-full bg-card border-border/50 border rounded -translate-x-2.5 relative px-2.5">
              <ArticleNumberInput />
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
