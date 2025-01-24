import { eduList } from "./cv-data";
import EducationElement from "./education-element";

export default function EduPanel() {
  return (
    <section className="w-full">
      <div className="w-full pb-2 mb-2.5 border-b border-border flex">
        <h3 className="mr-auto font-medium">Education</h3>
      </div>
      <div className="space-y-3">
        {eduList.map((item) => (
          <EducationElement item={item} key={item.schoolName} />
        ))}
      </div>
    </section>
  );
}
