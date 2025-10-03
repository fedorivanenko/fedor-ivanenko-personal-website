import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const sectionVariants = cva(
  "flex flex-col space-y-3 leading-relaxed tran",
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
}

function Section({ className, animated, card, ...props }: SectionProps) {
  return (
    <section
      className={cn(sectionVariants({ animated, card }), className, "")}
      {...props}
    />
  );
}

export { Section, sectionVariants };
