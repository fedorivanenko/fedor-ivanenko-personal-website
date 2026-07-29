import * as React from "react";

import styles from "./section.module.css";

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  as?: "section" | "div";
  animated?: boolean;
  card?: boolean;
}

function Section({
  className,
  animated = true,
  card = false,
  as = "section",
  ...props
}: SectionProps) {
  const classes = [
    styles.section,
    animated ? styles.animated : "",
    card ? styles.card : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(as, { className: classes, ...props }, props.children);
}

export { Section };
