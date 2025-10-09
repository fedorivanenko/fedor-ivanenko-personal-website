import * as React from 'react' 
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const sectionVariants = cva(
  "flex flex-col prose-short leading-relaxed scroll-m-20",
  {
    variants: {
      animated: {
        true: "animate-blur-fade stagger",
        false: "",
      },
      card: {
        true: "bg-card px-8 py-7.5 md:py-7.5 mx-2.5 rounded-2xl md:border boder-border dark:border-transparent",
        false: "px-7.5 mx-auto",
      },
    },
    defaultVariants: {
      animated: true,
      card: false,
    },
  }
);

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  className?: string;
  as?: 'section' | 'div'
}

function Section({ className, animated, card, as = 'section', ...props }: SectionProps) {
  return React.createElement(
    as,
    { className: cn(sectionVariants({ animated, card }), className), ...props },
    props.children
  );
}

export { Section, sectionVariants };
