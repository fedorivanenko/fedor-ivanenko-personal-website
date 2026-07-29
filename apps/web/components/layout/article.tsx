import type { HTMLAttributes } from "react";

import styles from "./article.module.css";

function Article({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={[styles.article, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export { Article };
