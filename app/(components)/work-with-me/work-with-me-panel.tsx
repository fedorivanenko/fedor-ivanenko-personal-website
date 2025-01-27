import * as React from "react";
import { Button } from "@/components/ui/button";

export default function WorkWithMe() {
  return (
    <div className="w-full">
      <h2 className="font-medium w-full pb-1.5 px-2.5">Work with me</h2>
      <div className="flex flex-col bg-card border rounded-lg border-input p-3.5">
        <div>
        <p className="text-muted-foreground mr-auto flex flex-col">
          I&apos;m availible as freelancer for Web Design, UX design, Design Engineering, and React/Next.js development.
          I create beautifully animated websites, 
          <Button className="w-full mt-auto" size="sm">
            Work with me
          </Button>
        </p>
        </div>
      </div>
    </div>
  );
}
