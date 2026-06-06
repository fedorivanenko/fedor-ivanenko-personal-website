import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Article({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={cn(
        "animation-container sm:space-y-18 col-start-2 mx-auto w-full max-w-[var(--content-width)] space-y-12 lg:mx-0",
        className
      )}
      {...props}
    />
  );
}

export { Article };
