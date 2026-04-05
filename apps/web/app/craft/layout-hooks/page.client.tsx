"use client";

import { useRef } from "react";
import { useSplitText, useMeasure, useIsHydrated } from "@fedor/layout-hooks";

export function Example() {
  const ref = useRef<HTMLHeadingElement>(null);
  const yes = useIsHydrated(ref);
  const { chars } = useSplitText(ref);
  useMeasure(chars, ref);

  return (
    <p
      ref={ref}
      style={{ 
        opacity: yes ? 1 : 0, 
        transition: "opacity 300ms ease" 
      }}
    >
      Added a standalone package definition plus TS/Vite bundler config so
      layout-hooks builds exactly like the other libraries
    </p>
  );
}
