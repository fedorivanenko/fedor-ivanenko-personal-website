/*
import { DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
*/
import CVelement from "./cv-element";
import { jobList } from "./cv-data";
import { Accordion } from "../../../components/ui/accordion";
import EduPanel from "./edu-panel";

export default function CVPanel() {
  return (
    <section className="w-full">
      <div className="w-full pb-2 mb-2.5 border-b border-border flex">
        <h2 className="mr-auto font-medium">CV</h2>
        {/*
        <Button className="text-xs translate-y-0.5" size="tiny" variant="ghost">
          <DownloadIcon style={{ width: "12px", height: "12px" }} />
          <span>Download CV</span>
        </Button>
         */}
      </div>
      <span className="text-muted-foreground space-y-5 leading-relaxed">
        <p>
          Having been a designer for almost a decade, I have always been
          somewhere around User Experience Design, working hard to understand
          people{"'"}s needs and build things that make life easier.
        </p>
      </span>
      <Accordion collapsible type="single" className="py-8 pb-9">
        {jobList.map((job) => (
          <CVelement job={job} key={job.jobTitle} />
        ))}
      </Accordion>
      <EduPanel />
    </section>
  );
}
