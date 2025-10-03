import { Section, sectionVariants } from "@/components/layout/section";
import { 
  //Button, 
  InlineLinkButton 
} from "@/components/ui/button";
import { cn } from "@/lib/utils";
//import Link from "next/link";

export function BioPanel() {
  return (
    <>
      <h1
        className={cn(
          sectionVariants(),
          "animate-blur-fade stagger mb-10"
        )}
      >
        Fedor Ivanenko
      </h1>
      <Section className="prose-short pr-16 sm:pr-32 md:pr-0 mb-15">
          <p>React / Next.js developer and UX designer.</p>
          <p>
            Love to create clear and practical websites{" "}
            <span className="whitespace-nowrap">
              and craft UX that is simple and obvious.
            </span>
          </p>
          <p>
            Do coding, design, and motion using{" "}
            <span className="whitespace-nowrap">
              mostly TypeScript, CSS, Next.js, and Sanity.
            </span>
          </p>
          <p>
            Open to collaborations with agencies and{" "}
            <span className="whitespace-nowrap">
              product teams, or in-house roles.
            </span>
          </p>
      </Section>
    </>
  );
}

/*
export function HireMePanel() {
  return (
    <Section card className="mb-15">
      <h2>Hire me</h2>
      <div className="prose-long">
        <p className="!leading-normal">
          I can build a website for you <br />
          <span className="whitespace-nowrap">
            — e-commerce, editorial, or a presentation one.
          </span>
        </p>
        <p>
          Or help you build complex UI/UX in React ecosystem,<br />
          optimize Next.js build, setup Sanity CMS,{" "}
          <span className="whitespace-nowrap">or create animations.</span>
        </p>
        <p>
          My rate is $400 per day, with a 4-day minimum,
          <br />
          or $4,000 and up on a per-project basis.
        </p>
        <div className="flex mt-6 gap-3">
          <Button variant={"outline"} className="w-min">
            Hire with Stripe
          </Button>
          
          <Button asChild variant={"outline"}><Link href={"mailto:f@fedor.studio"}>Book a call</Link></Button>
        </div>
      </div>
    </Section>
  );
}
 */

export function ProjectsPanel() {
  return (
    <Section>
      <h2>Projects</h2>
      <ul className="flex flex-col w-full">
        <li className="flex gap-2 items-center">
          <p>2025</p>
          <InlineLinkButton href={"https://www.hellojadey.com/"}>
            hellojadey.com
          </InlineLinkButton>
          <span className="text-sm">in collab with{" "}
          <InlineLinkButton className="text-sm" href={"https://www.hyuman.tech/"}>hyuman.tech</InlineLinkButton>{" & "}
          <InlineLinkButton className="text-sm" href={"https://wearemostlysunny.com/"}>mostly sunny</InlineLinkButton>
          </span>
        </li>
        <li className="flex gap-2">
          <p>2024</p>
          <InlineLinkButton href={"https://ivpay.io/"}>ivpay.io</InlineLinkButton>
        </li>
        <li className="flex gap-2">
          <p>2024</p>
          <InlineLinkButton href={"https://www.pzk.design/"}>pzk.design</InlineLinkButton>
        </li>
      </ul>
    </Section>
  );
}

export function PersonalityPanel() {
  return (
    <Section>
      <h2>Personality</h2>
      <div className="prose-long">
        <p>I care about experience, performance, and beauty.</p>
        <p>
          My favorite brand is Asics, my favorite car is the Dodge Viper,{" "}
          <span className="whitespace-nowrap">my favorite writer is Tufte,</span>{" "}and my favorite music is minimal techno.{" "}
          <span className="whitespace-nowrap">I also brew and drink specialty coffee.</span>
        </p>
        <p>
          I choose CSS over JS, a custom hook over a&nbsp;dependency
          (they’re a liability), <span className="whitespace-nowrap">global state over providers</span>, and
          a&nbsp;quick coded prototype over Figma.
        </p>
        <p>
          I love clean interfaces, having client state derived from
          the&nbsp;server,{" "}
          <span className="whitespace-nowrap">
            subtle typography and animations,
          </span>{" "}
          <span className="whitespace-nowrap sm:whitespace-normal">
            explicit error handling,{" "}
          </span>
          <span className="whitespace-nowrap">
            and profiler.
          </span>
        </p>
      </div>
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
        <br />
        <span className="whitespace-nowrap">
          Or check my{" "}
          <InlineLinkButton href="https://github.com/fedorivanenko">
            code
          </InlineLinkButton>
        </span>
      </p>
    </Section>
  );
}

export default function Home() {
  return (
    <main className="animation-container w-full space-y-20">
      <BioPanel />
      {/*
      <HireMePanel />
       */}
      <ProjectsPanel />
      <PersonalityPanel />
      <ContactPanel />
    </main>
  );
}
