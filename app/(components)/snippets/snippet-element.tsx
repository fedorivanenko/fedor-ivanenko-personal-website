"use client";

import * as React from "react";

import Link from "next/link";

import { motion, useTransform, useMotionValue, easeIn } from 'motion/react'

import {
  useCreateElementObserver,
  //useElementObserver
} from "@/hooks/use-element-observer";
import { useCreateCollisionDetector } from "@/hooks/use-collision-detector";

export default function SnippetElement() {
  const activatorRef = React.useRef<HTMLDivElement | null>(null);

  const id = React.useId()

  useCreateElementObserver(id, activatorRef);

  const { distances } = useCreateCollisionDetector("hover-peeker", id);

  const motionDistance = useMotionValue(400);

  React.useEffect(() => {
    if (distances?.yDistances) {
      const newDistance = Math.abs(distances.yDistances[1]?.[1] ?? 400);
      if (Math.abs(motionDistance.get() - newDistance) > 2) {
        motionDistance.set(newDistance);
      }
    }
  }, [distances.yDistances, motionDistance]);

  const height = useTransform(motionDistance, [0, 400], [200, 40], {ease: easeIn})

  return (
    <Link href="/ui/form-errors">
      <div
        ref={activatorRef}
        className="block space-y-1.5 relative w-[calc(100%+1.25rem)] -translate-x-2.5 py-2 px-2.5 my-3 border border-border rounded hover:cursor-pointer "
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          style={{
            height : height
          }}
          exit={{ opacity: 0 }}
          className="flex flex-col"
        >
          <div className="flex items-center mt-auto">
            <p className="font-medium leading-none underline-offset-4">
              Handling Form Errors
            </p>
          </div>
          <p className="flex gap-1.5 w-full text-muted-foreground">
            How to deal with different kind of form errors in UI
          </p>
        </motion.div>
      </div>
    </Link>
  );
}
