"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { animationConfigs, type AnimationConfigsKeys } from "@/lib/animations";

gsap.registerPlugin(useGSAP);

const DELAY = 0.125;

//<element data-animate="true" style="--stagger: 2; --duration: 500ms;">

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
      const animationKey = el.dataset.animation as AnimationConfigsKeys;
      
      if (animationKey && animationKey in animationConfigs) {
        const animationObject = animationConfigs[animationKey];

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