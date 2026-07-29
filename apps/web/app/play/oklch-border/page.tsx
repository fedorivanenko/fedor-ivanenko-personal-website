import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";

import o from "./oklab.module.css";
export default function PLayOKLCHBordersPage() {
  return (
    <Article>
      <Section>
        <div className={o.oklch}>OKLAB Color</div>
      </Section>
    </Article>
  );
}
