import { Separator } from "../../../components/ui/separator";
import SnippetElement from "./snippet-element";

export default function SnippetsPanel() {
  return (
    <div className="space-y-1.5">
      <div className="w-full flex flex-col">
        <h2 className="mr-auto font-medium mb-1.5">UI</h2>
        <Separator />
      </div>
      <div className="flex flex-col">
        <SnippetElement />
        <SnippetElement />
      </div>
    </div>
  );
}
