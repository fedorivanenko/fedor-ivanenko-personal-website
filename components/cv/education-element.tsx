import { EducationType } from "./cv-data";

export default function EducationElement({item}:{item:EducationType}) {
    return (
      <div>
        <div className="flex pb-0.5 items-center">
          <p className="font-medium">{item.degreeName}</p>
          <p className="ml-auto text-sm leading-none mt-0 text-muted-foreground space-x-[1px] flex">
            <span>{item.timeline.start}</span>
            <span>&ndash;</span>
            <span>{item.timeline.end}</span>
          </p>
        </div>
        <p className="flex text-base gap-1.5 w-full text-muted-foreground">
          {item.schoolName}
        </p>
      </div>
    );
}