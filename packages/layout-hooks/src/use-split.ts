'use client'

import { useLayoutEffect, useRef, useState } from "react";

export function useSplitText<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>
) {
  const charRefs = useRef<React.RefObject<HTMLSpanElement>[]>([]);
  const wordRefs = useRef<React.RefObject<HTMLSpanElement>[]>([]);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const originalHTML = el.innerHTML;
    const text = el.textContent?.trim();

    if (!text) return;

    const tokens = text.split(/(\s+)/);
    const htmlParts: string[] = [];

    for (const token of tokens) {
      if (/^\s+$/.test(token)) {
        htmlParts.push(`<span class="space" aria-hidden="true">&nbsp;</span>`);
      } else {
        htmlParts.push(`<span class="word" aria-hidden="true" style="white-space:nowrap">`);

        for (const ch of token) {
          const escaped = ch === " " ? "&nbsp;" : ch;
          htmlParts.push(
            `<span class="char" aria-hidden="true" style="display:inline-block">${escaped}</span>`
          );
        }

        htmlParts.push(`</span>`);
      }
    }

    // Accessible clone
    htmlParts.push(`<span class="sr-only">${text}</span>`);

    // Single DOM write
    el.innerHTML = htmlParts.join("");

    // Query nodes once
    const charNodes = el.querySelectorAll<HTMLSpanElement>(".char");
    const wordNodes = el.querySelectorAll<HTMLSpanElement>(".word");

    // Convert NodeList to array of refs
    charRefs.current = Array.from(charNodes, n => ({ current: n }));
    wordRefs.current = Array.from(wordNodes, n => ({ current: n }));

    // Trigger re-render now that refs are populated
    setReady(true);

    // Cleanup
    return () => {
      el.innerHTML = originalHTML;
      charRefs.current = [];
      wordRefs.current = [];
      setReady(false);
    };
  }, [ref]);

  return {
    chars: charRefs.current,
    words: wordRefs.current,
    ready,
  };
}