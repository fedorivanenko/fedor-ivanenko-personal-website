"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { animations } from "@/lib/animations";

gsap.registerPlugin(useGSAP);

const DELAY = 0.125 //sec

export function GsapAnimator({
  selector = "[data-animation]",
}: {
  selector?: string;
}) {
  useGSAP(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
    );

    if (!elements.length) return;

    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.out",
      },
    });

    elements.forEach((el, i) => {
      const animationKey = el.dataset.animation;
      if (animationKey && animationKey in animations) {
        const animationObject =
          animations[animationKey as keyof typeof animations];

        tl.fromTo(
          el,
          animationObject.from,
          { ...animationObject.to, ...animationObject.opts },
          i * DELAY
        );
      }
    });

    return () => tl.kill();
  }, []);

  return null;
}
