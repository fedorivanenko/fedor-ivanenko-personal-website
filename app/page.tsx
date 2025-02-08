import BioPanel from "@/app/(components)/bio/bio-panel";
import CVPanel from "@/app/(components)/cv/cv-panel"
import SnippetsPanel from "@/app/(components)/snippets/snippets-panel";
/*
import WorkWithMe from "@/components/work-with-me/work-with-me-panel";
import ClientProjectPanel from "@/components/client-projects/client-project-panel";
import PersonalProjectPannel from "@/components/personal-projects/personal-projects-panel"
*/
import ContactPanel from "@/app/(components)/contact/contact-panel";
import DesignBitsPanel from "./(components)/design-bits/design-bits-panel";

export default function Home() {
  return (
    <main className="w-full space-y-32 pb-32">
      <BioPanel />
      <DesignBitsPanel/>
      <SnippetsPanel/>
      <CVPanel />
      {/*
      <WorkWithMe/>
      <ClientProjectPanel/>
      <PersonalProjectPannel />
      */}
      <ContactPanel />
      <blockquote className="text-muted-foreground">
            <p className="italic text-right">{"“"}Simplicity is sanity{"”"}</p>
            <p className="text-right pr-2 text-sm">— John Maeda</p>
            </blockquote>
    </main>
  );
}
