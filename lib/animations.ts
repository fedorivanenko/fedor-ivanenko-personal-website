type AnimationConfig = {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  opts: gsap.TweenVars;
};

const animationConfigs = {
  fadeInUp: {
    from: { opacity: 0, y: 40, filter: "blur(20px)" },
    to:   { opacity: 1, y: 0, filter: "blur(0px)" },
    opts: { duration: 1, ease: 'power2.out' }
  },
  fadeInDown: {
    from: { opacity: 0, y: -40, filter: "blur(20px)" },
    to:   { opacity: 1, y: 0, filter: "blur(0px)" },
    opts: { duration: 1, ease: 'power2.out' }
  },
} satisfies Record<string, AnimationConfig>;

type AnimationConfigsKeys = keyof typeof animationConfigs;

export { animationConfigs }
export type { AnimationConfig, AnimationConfigsKeys }