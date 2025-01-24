import { 
    AccordionContent,
    AccordionItem,
    AccordionTrigger
 } from "../ui/accordion";

import { JobType } from "./cv-data";

export default function CVelement({ job }: { job: JobType }) {

  return (
    <AccordionItem value={job.timeline.start.toString()}>
      <AccordionTrigger>
        <div className="flex pb-0.5 sm:items-center flex-col sm:flex-row">
          <p className="sm:ml-auto sm:order-last text-xs mb-0.5 sm:mb-0 sm:text-sm leading-none mt-0 text-muted-foreground space-x-[1px] flex">
            <span>{job.timeline.start}</span>
            <span>&ndash;</span>
            <span>{job.timeline.end}</span>
          </p>
          <p className="font-medium">{job.jobTitle}</p>
        </div>
        <p className="flex text-base gap-1.5 leading-none w-full text-muted-foreground">
            {job.companyName} 
        </p>
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground space-y-4 leading-relaxed pb-9">
        {job.description?.map((i, k) => (
          <p key={k}>{i}</p>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
