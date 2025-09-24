import { AnimationKeys } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const sectionVariants = cva(
  "flex flex-col space-y-3 leading-relaxed px-5 mx-auto",
  {
    variants: {
      variant: {
        default: "",
        card: "bg-card py-5 mx-2.5 px-5 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  className?: string;
  dataAnimation?: AnimationKeys | null;
}

function Section({
  className,
  dataAnimation = "fadeInUp",
  variant,
  ...props
}: SectionProps) {
  return (
    <section
      data-animation={dataAnimation}
      className={cn(sectionVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Section, sectionVariants };
