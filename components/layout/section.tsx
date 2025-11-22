import * as React from 'react' 
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const sectionVariants = cva(
  "flex flex-col prose scroll-m-20",
  {
    variants: {
      animated: {
        true: "animate-blur-fade stagger",
        false: "",
      },
      card: {
        true: "bg-card py-7.5 -mx-2.5 border border-card-border",
        false: "mx-0",
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
