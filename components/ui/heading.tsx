import * as React from "react";
import { Separator } from "./separator";

export default function Heading({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className="w-full pb-3 flex flex-col space-y-1.5">
      <h2 className="font-medium text-foreground capitalize">{children}</h2>
      <Separator />
    </div>
  );
}
