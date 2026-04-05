import { cloneElement, isValidElement, type ReactElement } from "react";
import { Section, sectionVariants } from "@/components/layout/section";
import { buttonVariants, InlineLinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function BioPanel() {
  return (
    <>
      <div
        className={cn(sectionVariants({ animated: true }), "!space-y-0 mb-12")}
      >
        <h1 className="!leading-tight">Fedor Ivanenko</h1>
        <p className="text-[17px] text-muted-foreground leading-0 whitespace-nowrap max-w-min">
          Design Engineer
        </p>
      </div>
      <Section>
        <div className="prose">
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
            I build websites using TS, CSS, React, Next.js, Shopify and Sanity
          </p>
        </div>
      </Section>
    </>
  );
}

function CraftPanel() {
  return (
    <Section>
      <h2>Craft</h2>
      <ul>
      <li className="">
        <InlineLinkButton href={"/craft/wheel-picker"} target="_self">
          Wheel Picker
        </InlineLinkButton>
        <span className="block text-muted-foreground text-sm mt-0.5">
          React component. Validation, a11y, and keyboard controls are included
        </span>
      </li>
      </ul>
    </Section>
  );
}

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
    description: <p>Personal website. Design and development</p>,
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
    const descriptionClassName = "whitespace-nowrap text-sm";
    if (descriptionElement) {
      return cloneElement(descriptionElement, {
        className: cn(descriptionClassName, descriptionElement.props.className),
      });
    }
    return <p className={descriptionClassName}>{description}</p>;
  };

  return (
    <li className="contents text-muted-foreground text-base">
      <span>{year}</span>
      {renderName()}
      {renderDescription()}
    </li>
  );
}

function ProjectsPanel() {
  return (
    <Section className="relative mb-10 sm:mb-16" id="projects">
      <h2>Participations</h2>
      <p>I made several websites and you can hire me to build one.</p>
      <div className="z-10 absolute w-5 h-full pointer-events-none bg-gradient-to-r from-transparent to-background top-0 -right-5" />
      <div className="z-10 absolute w-5 h-full pointer-events-none bg-gradient-to-l from-transparent to-background top-0 -left-5" />
      <div className="overflow-x-scroll min-h-12 space-y-3 -mx-5 px-5 pb-2">
        <ul className="w-fit grid grid-cols-[max-content_max-content_max-content] gap-x-3 gap-y-0.5 pr-2.5">
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
      <div className="prose max-w-sm sm:max-w-xl">
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

function CurriculumPanel() {
  return (
    <Section>
      <h2>Curriculum</h2>
      <div className="prose">
        <p>Born in Siberia in 1988, I began my design journey in 2012.</p>
        <p>
          In 2017, I earned a degree in Graphic Design and began working as an
          <InlineLinkButton
            href={"https://segd.org/about/what-is-experience-design/"}
          >
            Environmental Experience Designer
          </InlineLinkButton>
          , working with large-scale public spaces such as stadiums and
          hospitals. During this time, I also began coding and studying computer
          science.
        </p>
        <p>
          In 2020, driven by a growing interest in user experience, I
          transitioned into digital UX design and user research, working
          independently on projects such as AR navigation.
        </p>
        <p>
          After emigrating in 2021, I gradually shifted toward engineering and
          became a&nbsp;full-time React / Next.js developer by 2024.
        </p>
        <p>
          Today, I work independently as a designer and developer, pursuing my
          interest in generative UI and human{"–"}machine
          interaction.
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
      <CraftPanel />
      <ProjectsPanel />
      <CurriculumPanel />
      <PersonalityPanel />
      <ContactPanel />
    </article>
  );
}
