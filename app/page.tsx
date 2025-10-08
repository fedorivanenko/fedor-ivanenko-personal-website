import { Section, sectionVariants } from "@/components/layout/section";
import {
  buttonVariants,
  InlineLinkButton,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";

function BioPanel() {
  return (
    <>
      <h1 className={cn(sectionVariants(), "animate-blur-fade stagger mb-12")}>
        Fedor Ivanenko
      </h1>
      <Section>
        <div className="prose-short max-w-xs md:max-w-max">
          <p>React / Next.js developer and UX designer.</p>
          <p>
            Love to create clear and practical websites and craft UX that is
            simple and obvious.
          </p>
          <p>
            Do coding, design, and motion using mostly TypeScript, CSS, Next.js,
            and Sanity.
          </p>
          <p>
            Open to collaborations with agencies and product teams, or in-house
            roles.
          </p>
        </div>
      </Section>
    </>
  );
}

import { cloneElement, isValidElement, ReactElement } from 'react';

interface ProjectData extends React.HTMLAttributes<HTMLLIElement> {
  year: number
  name: string
  href?: string
  description: React.ReactNode
}

function ProjectRow({ year, href, name, description }: ProjectData) {

  const isDescriptionElement = isValidElement(description);
  const descriptionElement = isDescriptionElement
    ? (description as ReactElement<{ className?: string }>)
    : null;

  const renderName = () => {
    const nameClassName = "-translate-y-[1px] justify-start mr-1";
    if (href) {
      return <InlineLinkButton href={href} className={nameClassName}>{name}</InlineLinkButton>;
    }
    return (
      <p
        className={cn(
          buttonVariants({ variant: "link", size: "inline" }),
          "px-0", nameClassName
        )}
      >
        {name}
      </p>
    );
  };

  const renderDescription = () => {
    const descriptionClassName = "whitespace-nowrap";
    if (descriptionElement) {
      return cloneElement(descriptionElement, {
        className: cn(descriptionClassName, descriptionElement.props.className),
      });
    }
    return <p className={descriptionClassName}>{description}</p>;
  };

  return (
    <li className="contents overflow-x-scroll">
      <p>{year}</p>
      {renderName()}
      {renderDescription()}
    </li>
  );
}

const projectsData:ProjectData[] = [
  {
    year: 2025,
    name: "hellojadey.com",
    href: "https://www.hellojadey.com/",
    description: (
      <p>
        Development via{" "}
        <InlineLinkButton href="https://www.hyuman.tech/">
          hyuman.tech
        </InlineLinkButton>
      </p>
    )
  },
  {
    year: 2025,
    name: "TBA",
    description: (
      <p>
        Development via{" "}
        <InlineLinkButton href="https://midnight.agency/">
          midnight.agency
        </InlineLinkButton>
      </p>
    )
  },
  {
    year: 2024,
    name: "ivpay.io",
    href: "https://ivpay.io/",
    description: <p>Development</p>
  },
  {
    year: 2024,
    name: "pzk.design",
    href: "https://www.pzk.design/",
    description: <p>Design and development</p>
  }
];

function ProjectsPanel() {
  return (
    <Section className="overflow-x-scroll mb-7.5 pb-7.5">
      <h2>Projects</h2>
      <ul className="grid grid-cols-[auto_auto_auto] gap-x-3 md:gap-x-5 gap-y-1 mr-auto">
        {projectsData.map((project) => (
          <ProjectRow
            key={`${project.year}-${project.name}`}
            {...project}
          />
        ))}
      </ul>
    </Section>
  );
}

function PersonalityPanel() {
  return (
    <Section>
      <h2>Personality</h2>
      <div className="prose-long max-w-sm sm:max-w-xl">
        <p>I care about experience, performance,&nbsp;and&nbsp;beauty.</p>
        <p>
          My favorite brand is Asics, my favorite car is&nbsp;Dodge Viper,
          and&nbsp;my&nbsp;favorite music is&nbsp;
          <InlineLinkButton href="https://youtu.be/M5cRHG-rA04">
            nightcore
          </InlineLinkButton>{" "}
          and{" "}
          <InlineLinkButton href="https://youtu.be/8dercZbT3Tw">
            techno
          </InlineLinkButton>
          . I also brew and drink specialty&nbsp;coffee.
        </p>
        <p>
          I choose CSS over JS, a custom hook over a&nbsp;dependency,
          a&nbsp;global state over&nbsp;providers, and a&nbsp;quickly coded
          prototype over&nbsp;Figma.
        </p>
        <p>
          I love clean interfaces, having client state derived from
          the&nbsp;server, subtle typography and animations, explicit error
          handling, and using&nbsp;the&nbsp;profiler.
        </p>
      </div>
    </Section>
  );
}

function ContactPanel() {
  return (
    <Section>
      <h2>Connect</h2>
      <p>
        Reach me at{" "}
        <InlineLinkButton href="https://x.com/fedorivanenko_">
          @fedorivanenko_
        </InlineLinkButton>{" "}
        <span className="whitespace-nowrap">or{" "}
        <InlineLinkButton href="mailto:f@fedor.studio">
          f@fedor.studio
        </InlineLinkButton>
        </span>
      </p>
    </Section>
  );
}

export default function Home() {
  return (
    <main>
      <BioPanel />
      <ProjectsPanel />
      <PersonalityPanel />
      <ContactPanel />
    </main>
  );
}
