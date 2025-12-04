import { Section } from "@/components/layout/section";
import { Chart } from "@fedor/spark-charts";

export default function CraftChartPage() {
    return(
        <article>
            <Section className="text-[blue]">
                <Chart/>
            </Section>
        </article>
    )
}