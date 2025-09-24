import { Section } from "@/components/layout/section";
import { Button, InlineLinkButton } from "@/components/ui/button";

export function BioPanel() {
  return (
    <Section dataAnimation={null}>
      <h1 data-animation="fadeInUp" className="text-lg">Fedor Ivanenko</h1>
      <div data-animation="fadeInUp" className="space-y-3 md:space-y-1.5 mr-20 sm:mr-40 md:mr-0">
        <p>React / Next.js developer and UX designer.</p>
        <p>
          Love to create clear and practical websites and{" "}
          <span className="whitespace-nowrap">
            craft UX that is simple and obvious.
          </span>
        </p>
        <p>
          Code, design, and animate using mostly{" "}
          <span className="whitespace-nowrap">
            TypeScript, GSAP, Next.js, and Sanity.
          </span>
        </p>
        <p className="">
          Open to collaborations with agencies and{" "}
          <span className="whitespace-nowrap">
            product teams, or in-house roles.
          </span>
        </p>
      </div>
    </Section>
  );
}

export function HireMePanel() {
  return(
    <Section variant={'card'}>
      <h2>Hire me</h2>
      <p>
        
      </p>
      <p className="mb-5">
        You can hire me for $400 a day<br/>
        5 days minimal involment
      </p>
      <Button>Hire with Stripe</Button>
    </Section>
  )
}

export function BlogPanel() {
  return (
    <Section>
      <h2>Writings</h2>

    </Section>
  );
}

export function ContactPanel() {
  return (
    <Section>
      <h2>Connect</h2>
      <p>
        Reach me at{" "}
        <InlineLinkButton href="https://x.com/fedorivanenko_">
          @fedorivanenko_
        </InlineLinkButton>{" "}
        or{" "}
        <InlineLinkButton href="mailto:f@fedor.studio">
          f@fedor.studio
        </InlineLinkButton>
        <br/>
        <span className="whitespace-nowrap">  
          Or check my{" "}
          <InlineLinkButton href="https://github.com/fedorivanenko">
            GitHub
          </InlineLinkButton>
        </span>
      </p>
    </Section>
  );
}

export default function Home() {
  return (
    <main className="w-full space-y-20">
      <BioPanel />
      <HireMePanel />
      <BlogPanel />
      <ContactPanel />
    </main>
  );
}
