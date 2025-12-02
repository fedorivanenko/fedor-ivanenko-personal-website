"use client";

import * as React from "react";
import { Section } from "@/components/layout/section";
/*
    | Key | Action                   |
    | --- | ------------------------ |
    | `}` | Move down one section    |
    | `{` | Move up one section      |
    | `j` | Move to next element     |
    | `k` | Move to previous element |
    | `v` | Enter selection mode     |
    |`esc`| Exit selection mode      |
*/

export function useDataRegistry() {

  const elements = React.useRef<HTMLElement[]>([]);

  const register = (el: HTMLElement | null) => {
    if (!el) return;
    elements.current.push(el);
  };

  return { elements, register };
}

export default function PlayKeboardNavPage() {
  const { elements, register } = useDataRegistry();

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "}") {
        const first = elements.current[0];
        if (!first) return;
  
        first.focus();
      }
    };

    /**
    select by { and }, WHEN selected enter selection mode with v 
    esc exit selection mode
     */
    
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [elements]);
  
  return (
    <article>
      <Section card className="aspect-video justify-center items-center">
        <div
          ref={register}
          tabIndex={-1}
          contentEditable="false"
          suppressContentEditableWarning={true}
          onBeforeInput={(e) => e.preventDefault()}
          role="textbox"
          aria-readonly="true"
          aria-multiline="true"
          className="bg-amber-200 p-4 ring-0 focus:ring-0 outline-none focus:bg-amber-300 focus:outline-none"
        >
          <p>Some text to navigate and copy...</p>
          <p>Some text to navigate and copy...</p>
          <button>Heelo?</button>
            
        </div>
      </Section>
    </article>
  );
}
