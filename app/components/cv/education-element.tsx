import { EducationType } from "./cv-data";

export default function EducationElement({item}:{item:EducationType}) {
    return (
      <div className="py-3">
        <div className="flex sm:items-center flex-col sm:flex-row">
          <p className="sm:ml-auto sm:order-last text-xs mb-0.5 sm:mb-0 sm:text-sm leading-none mt-0 text-muted-foreground space-x-[1px] flex">
            <span>{item.timeline.start}</span>

            {item.timeline.end !== null && (
              <>
                <span>&ndash;</span>
                <span>{item.timeline.end}</span>
              </>
            )}
          </p>
          <p className="font-medium">{item.degreeName}</p>
        </div>
        <p className="flex text-base gap-1.5 w-full text-muted-foreground">
          {item.schoolName}
        </p>
      </div>
    );
}