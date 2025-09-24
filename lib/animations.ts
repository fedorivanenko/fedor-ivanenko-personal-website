type AnimationConfig = {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  opts: gsap.TweenVars;
};

const animations = {
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

type AnimationKeys = keyof typeof animations;

export { animations }
export type {AnimationKeys}