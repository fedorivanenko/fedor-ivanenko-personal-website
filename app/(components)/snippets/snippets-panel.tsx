//import { Separator } from "../../../components/ui/separator";
import SnippetElement from "./snippet-element";

export default function SnippetsPanel() {
  return (
    <div className="space-y-1.5">
      <h2 className="mr-auto font-medium">UI</h2>
      <p className="text-muted-foreground space-y-5 leading-relaxed">
        A bit more comprehensive studies on <span className="whitespace-nowrap">human-machine</span> interactions
      </p>
      <div className="flex flex-col pt-2.5">
        <SnippetElement />
      </div>
    </div>
  );
}
