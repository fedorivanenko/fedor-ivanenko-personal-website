import { eduList } from "./cv-data";
import EducationElement from "./education-element";

export default function EduPanel() {
  return (
    <section className="w-full space-y-1.5">
      <h3 className="mr-auto font-medium">Education</h3>
      <div className="divide-y divide-border">
        {eduList.map((item) => (
          <EducationElement item={item} key={item.schoolName} />
        ))}
      </div>
    </section>
  );
}
