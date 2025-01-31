import BioPanel from "@/app/(components)/bio/bio-panel";
import CVPanel from "@/app/(components)/cv/cv-panel"
import SnippetsPanel from "@/app/(components)/snippets/snippets-panel";
/*
import WorkWithMe from "@/components/work-with-me/work-with-me-panel";
import ClientProjectPanel from "@/components/client-projects/client-project-panel";
import PersonalProjectPannel from "@/components/personal-projects/personal-projects-panel"
*/
import ContactPanel from "@/app/(components)/contact/contact-panel";

export default function Home() {
  return (
    <main className="w-full space-y-32 pb-32">
      <BioPanel />
      <SnippetsPanel/>
      <CVPanel />
      {/*
      <WorkWithMe/>
      <ClientProjectPanel/>
      <PersonalProjectPannel />
      */}
      <ContactPanel />
    </main>
  );
}
