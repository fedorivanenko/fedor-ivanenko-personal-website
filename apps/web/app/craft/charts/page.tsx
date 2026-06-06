import { Article } from "@/components/layout/article";
import { Section } from "@/components/layout/section";
import { Chart } from "@fedor/spark-charts";

export default function CraftChartPage() {
  return (
    <Article>
      <Section className="text-[blue]">
        <Chart />
      </Section>
    </Article>
  );
}
