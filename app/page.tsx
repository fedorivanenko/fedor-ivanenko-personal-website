import { Section, sectionVariants } from "@/components/layout/section";
import { buttonVariants, InlineLinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function BioPanel() {
  return (
    <>
      <div
        className={cn(sectionVariants({ animated: true }), "!space-y-0 mb-12")}
      >
        <h1>Fedor Ivanenko</h1>
        <p className="text-muted-foreground bg-muted rounded-md px-2 py-0.25 -mx-0.75 mt-1.5 text-xs whitespace-nowrap max-w-min">
          designer + engineer
        </p>
      </div>
      <Section>
        <div className="prose-short">
          <p>
            I care about experience, performance, and beauty,{" "}
            <br className="hidden md:block" />
            <InlineLinkButton href="https://maxleiter.com/blog/ship-every-day">
              ship daily,
            </InlineLinkButton>{" "}
            aim for{" "}
            <InlineLinkButton
              className="whitespace-break-spaces inline-block"
              href="https://github.com/tigerbeetle/tigerbeetle/blob/ac75926f8868093b342ce2c64eac1e3001cf2301/docs/TIGER_STYLE.md#technical-debt"
            >
              zero
            </InlineLinkButton>{" "}
            technical debt, and pursue{" "}
            <InlineLinkButton href="https://lawsofsimplicity.com/">
              simplicity
            </InlineLinkButton>
            .
          </p>
          <p>
            I build clear and practical websites and craft UX that is simple and
            obvious. <br className="hidden md:block" />
            Using mostly TypeSscript, CSS, React, Next.js, and Sanity.
          </p>
        </div>
      </Section>
    </>
  );
}

function CarftPanel() {
  return (
    <Section>
      <h2>Craft</h2>
      <p>
        <InlineLinkButton href={"/craft/wheel-picker"} target="_self">
          Wheel Picker
        </InlineLinkButton>
        <span className="block text-muted-foreground text-sm mt-0.5">
          React component. Validation, a11y, and keyboard controls are included.
        </span>
      </p>
    </Section>
  );
}

import { cloneElement, isValidElement, ReactElement } from "react";

interface ProjectData extends React.HTMLAttributes<HTMLLIElement> {
  year: number;
  name: string;
  href?: string;
  description: React.ReactNode;
}

const projectsData: ProjectData[] = [
  {
    year: 2025,
    name: "hellojadey.com",
    href: "https://www.hellojadey.com/",
    description: (
      <p>
        E-commerce website. Development via{" "}
        <InlineLinkButton href="https://www.hyuman.tech/">
          hyuman.tech
        </InlineLinkButton>
      </p>
    ),
  },
  {
    year: 2025,
    name: "TBA",
    description: (
      <p>
        Editorial website. Development via{" "}
        <InlineLinkButton href="https://midnight.agency/">
          midnight.agency
        </InlineLinkButton>
      </p>
    ),
  },
  {
    year: 2024,
    name: "ivpay.io",
    href: "https://ivpay.io/",
    description: <p>Marketing website. Development</p>,
  },
  {
    year: 2024,
    name: "pzk.design",
    href: "https://www.pzk.design/",
    description: <p>Pesonal website. Design and development</p>,
  },
];

function ProjectRow({ year, href, name, description }: ProjectData) {
  const isDescriptionElement = isValidElement(description);
  const descriptionElement = isDescriptionElement
    ? (description as ReactElement<{ className?: string }>)
    : null;

  const renderName = () => {
    const nameClassName = "-translate-y-[1px] justify-start mr-1";
    if (href) {
      return (
        <InlineLinkButton href={href} className={nameClassName}>
          {name}
        </InlineLinkButton>
      );
    }
    return (
      <p
        className={cn(
          buttonVariants({ variant: "link", size: "inline" }),
          "px-0",
          nameClassName
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
    <li className="contents text-muted-foreground text-sm ">
      <p>{year}</p>
      {renderName()}
      {renderDescription()}
    </li>
  );
}

function ProjectsPanel() {
  return (
    <Section className="pt-5 pb-0 px-0 relative overflow-hidden" id="projects" card>
      <div className="absolute w-20 h-full pointer-events-none bg-gradient-to-r from-transparent to-card/50 top-0 right-0" />
      <div className="pl-7.5 pb-7.5 overflow-x-scroll space-y-3">
        <h2 className="!mb-1.5">Patricipations</h2>
        <p>I made several websites and you can hire me to build one.</p>
        <ul className="w-fit grid grid-cols-[max-content_max-content_max-content] gap-x-7.5 gap-y-1 pr-20">
          {projectsData.map((project) => (
            <ProjectRow key={`${project.year}-${project.name}`} {...project} />
          ))}
        </ul>
      </div>
    </Section>
  );
}

function PersonalityPanel() {
  return (
    <Section id="personality">
      <h2>Personality</h2>
      <div className="prose-long max-w-sm sm:max-w-xl">
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
          a&nbsp;global store over&nbsp;contex providers, and a&nbsp;quickly
          coded prototype over&nbsp;Figma.
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
    <Section id="contacts">
      <h2>Connect</h2>
      <p>
        Reach me at{" "}
        <InlineLinkButton href="https://x.com/fedorivanenko_">
          @fedorivanenko_
        </InlineLinkButton>{" "}
        <span className="whitespace-nowrap">
          or{" "}
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
    <article className="animation-container">
      <BioPanel />
      <CarftPanel/>
      <ProjectsPanel />
      <PersonalityPanel />
      <ContactPanel />
    </article>
  );
}
