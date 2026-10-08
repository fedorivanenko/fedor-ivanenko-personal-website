import { ContactDialog } from "@/components/contact-dialog";
import ThemeToggle from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-svh bg-[#fafafa] text-[#151515] dark:bg-[#111211] dark:text-[#eeeeea]">
      <nav className="sticky top-0 z-20 border-b border-[#ddddda] bg-[#fafafa]/95 text-[0.6875rem] dark:border-[#343532] dark:bg-[#111211]/95">
        <div className="flex h-14 items-center justify-between gap-6 px-5 sm:px-7">
          <a
            href="#top"
            className="flex items-center gap-3 outline-none focus-visible:ring-1 focus-visible:ring-[#36ef2a]"
          >
            <span
              aria-hidden="true"
              className="size-5 border border-[#36ef2a] bg-[#58ff47] shadow-[0_0_12px_rgba(88,255,71,0.55)]"
            />
            <span>fedor.studio / index</span>
          </a>
          <div className="flex min-w-0 items-center gap-5">
            <a className="hidden hover:underline sm:inline" href="#work">
              Work
            </a>
            <a
              className="hidden hover:underline sm:inline"
              href="https://nazare.engineering"
              target="_blank"
              rel="noreferrer"
            >
              Nazaré ↗
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <div
        aria-hidden="true"
        className="overflow-hidden border-b border-[#ecece9] px-5 py-1.5 text-[0.625rem] leading-none whitespace-nowrap text-[#c1c2bd] select-none dark:border-[#242522] dark:text-[#41423e]"
      >
        ──→ design ∙ engineering ∙ commerce ┼ shopify ∙ next.js ∙ liquid
        ┼ systems that remain useful ──→ design ∙ engineering ∙ commerce ┼
        shopify ∙ next.js ∙ liquid
      </div>

      <main id="top" className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-7 md:py-24">
        <header className="max-w-2xl">
          <p className="font-semibold">Fedor Ivanenko</p>
          <p className="mt-1 text-[#71716d] dark:text-[#989994]">
            E-commerce Design Engineer
          </p>

          <div className="mt-9 space-y-4 leading-6">
            <p>
              I build custom Shopify and Next.js storefronts for design-led
              brands and studios.
            </p>
            <p>
              Design-faithful on the surface. Fast, dependable, and
              maintainable underneath.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <ContactDialog />
            <span className="flex items-center gap-2 text-[0.75rem] text-[#71716d] dark:text-[#989994]">
              <span
                aria-hidden="true"
                className="size-2 bg-[#58ff47] shadow-[0_0_8px_rgba(88,255,71,0.65)]"
              />
              Available for selected projects
            </span>
          </div>
        </header>

        <section id="work" className="mt-24 scroll-mt-20" aria-labelledby="work-title">
          <div className="flex items-end justify-between gap-4 border-b border-[#ccccca] pb-3 dark:border-[#3b3c39]">
            <h2 id="work-title" className="font-semibold">
              Selected work
            </h2>
            <span className="text-[0.6875rem] text-[#858681]">03 projects</span>
          </div>

          <div className="bg-[radial-gradient(circle,#dededb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(circle,#30312e_1px,transparent_1px)]">
            <article className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-[#ddddda] bg-[#fafafa]/88 py-5 backdrop-blur-[1px] sm:grid-cols-[2rem_1.05fr_1fr_auto] dark:border-[#343532] dark:bg-[#111211]/88">
              <span className="text-[#858681]">01</span>
              <h3 className="font-semibold">Alkamind</h3>
              <p className="col-start-2 mt-1 text-[#71716d] sm:col-start-auto sm:mt-0 dark:text-[#989994]">
                Shopify theme rebuild
              </p>
              <p className="col-start-2 mt-2 text-[0.6875rem] uppercase tracking-[0.08em] sm:col-start-auto sm:mt-0">
                Awaiting launch
              </p>
            </article>

            <article className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-[#ddddda] bg-[#fafafa]/88 py-5 backdrop-blur-[1px] sm:grid-cols-[2rem_1.05fr_1fr_auto] dark:border-[#343532] dark:bg-[#111211]/88">
              <span className="text-[#858681]">02</span>
              <h3 className="font-semibold">Exeter</h3>
              <p className="col-start-2 mt-1 text-[#71716d] sm:col-start-auto sm:mt-0 dark:text-[#989994]">
                Next.js + Sanity
              </p>
              <p className="col-start-2 mt-2 text-[0.6875rem] uppercase tracking-[0.08em] sm:col-start-auto sm:mt-0">
                Awaiting launch
              </p>
            </article>

            <a
              className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-[#ddddda] bg-[#fafafa]/88 py-5 backdrop-blur-[1px] transition-colors hover:bg-[#f1f1ee] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#36ef2a] sm:grid-cols-[2rem_1.05fr_1fr_auto] dark:border-[#343532] dark:bg-[#111211]/88 dark:hover:bg-[#1a1b19]"
              href="https://www.hellojadey.com/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-[#858681]">03</span>
              <h3 className="font-semibold">Jadey ↗</h3>
              <p className="col-start-2 mt-1 text-[#71716d] sm:col-start-auto sm:mt-0 dark:text-[#989994]">
                Next.js + Sanity + Supabase
              </p>
              <p className="col-start-2 mt-2 flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.08em] sm:col-start-auto sm:mt-0">
                <span aria-hidden="true" className="size-2 bg-[#58ff47]" />
                Live
              </p>
            </a>
          </div>
        </section>

        <section className="mt-24 grid gap-10 border-t border-[#ccccca] pt-5 sm:grid-cols-[1fr_2fr] dark:border-[#3b3c39]">
          <h2 className="font-semibold">Practice</h2>
          <div className="space-y-5 leading-6">
            <p>
              I began in product design and now engineer storefronts. My work
              focuses on design fidelity, maintainable systems, merchant
              usability, and dependable delivery.
            </p>
            <p>
              I partner with design studios, e-commerce agencies, and brands on
              complete builds or focused implementation work.
            </p>
          </div>
        </section>

        <section className="mt-20 border border-[#ccccca] bg-[radial-gradient(circle,#dededb_1px,transparent_1px)] p-5 [background-size:20px_20px] dark:border-[#3b3c39] dark:bg-[radial-gradient(circle,#30312e_1px,transparent_1px)]">
          <div className="bg-[#fafafa]/90 p-5 dark:bg-[#111211]/90">
            <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-[#71716d] dark:text-[#989994]">
              Building in public
            </p>
            <h2 className="mt-3 font-semibold">Nazaré</h2>
            <p className="mt-3 max-w-xl leading-6">
              Open-source, Liquid-first infrastructure for Shopify themes that
              stay easier to build, maintain, and evolve.
            </p>
            <a
              className="mt-5 inline-block border border-[#9b9c97] bg-[#fafafa] px-3 py-2 text-[0.75rem] hover:border-[#151515] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#36ef2a] dark:bg-[#111211] dark:hover:border-[#eeeeea]"
              href="https://nazare.engineering"
              target="_blank"
              rel="noreferrer"
            >
              Explore Nazaré ↗
            </a>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-3xl flex-col gap-3 border-t border-[#ddddda] px-5 py-6 text-[0.6875rem] text-[#71716d] sm:flex-row sm:items-center sm:justify-between sm:px-7 dark:border-[#343532] dark:text-[#989994]">
        <span>Fedor Studio · {new Date().getFullYear()}</span>
        <div className="flex gap-5">
          <a
            className="hover:text-[#151515] hover:underline dark:hover:text-[#eeeeea]"
            href="https://github.com/fedorivanenko"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <a
            className="hover:text-[#151515] hover:underline dark:hover:text-[#eeeeea]"
            href="https://x.com/fedorivanenko_"
            target="_blank"
            rel="noreferrer"
          >
            X ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
