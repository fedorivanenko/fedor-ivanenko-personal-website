import { Section } from "@/components/layout/section";

import o from "./oklab.module.css";
//import s from "./blend.module.css";

export default function PLayOKLCHBordersPage() {
  return (
    <article>
      <Section>
        <div className={o.oklch}>OKLAB Color</div>
      </Section>
    </article>
  );
}
