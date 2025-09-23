
import { DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import CVelement from "./cv-element";
import { jobList } from "./cv-data";
import { Accordion } from "../../../components/ui/accordion";
import EduPanel from "./edu-panel";

export default function CVPanel() {
  return (
    <section className="w-full space-y-2.5">
      <div className="flex justify-between">
        <h2 className="mr-auto font-medium">CV</h2>
        <Button className="text-xs h-5  cursor-pointer" size="tiny" variant="default" asChild>
          <Link 
            href="https://jkuelpwgku.ufs.sh/f/OHDYg8ahfniIPdjVSYkS4lycpsGYWrv9XIEBk2gamhF15tOC"
            aria-label="Download CV"
            title="Download CV"
          >
            <DownloadIcon style={{ width: "12px", height: "12px" }} />
            Download CV
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground space-y-5 leading-relaxed">
        Having been a designer for almost a decade, I&nbsp;have always been
        somewhere around User Experience Design, working hard to understand
        people{"'"}s needs and build things that make life easier.
      </p>
      <Accordion collapsible type="single" className="pb-10">
        {jobList.map((job) => (
          <CVelement job={job} key={job.jobTitle} />
        ))}
      </Accordion>
      <EduPanel />
    </section>
  );
}
