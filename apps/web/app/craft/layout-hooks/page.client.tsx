"use client";

import * as React from "react";
import { useSplitText, useMeasure } from "@fedor/layout-hooks";

export function SplitText({ children }: { children: React.ReactNode }) {
  
  const ref = React.useRef<HTMLParagraphElement>(null);
  const { words } = useSplitText(ref);

  const m = useMeasure(words, ref)

  React.useEffect(() => {
    
    console.log('Initial rects:', m.getRects()[10]);
    const unsubscribe = m.subscribe(() => {
      console.log('Rects updated:', m.getRects()[10]);
    });
  
    return unsubscribe;
  }, [m]);

  return (
    <>
      <p ref={ref}>
        {children}
      </p>
    </>
  );
}
