"use client";

import * as m from "motion/react-m";

export default function Pulse() {
  return (
    <m.span
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        duration: 1.75,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: [0.52, 0, 0.58, 1],
      }}
      className="bg-red-600/90 rounded-full h-[9px] w-[9px] inline-block -translate-y-[0px] relative"/>
  );
}
