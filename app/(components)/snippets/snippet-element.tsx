"use client";

import * as React from "react";

import Link from "next/link";

export default function SnippetElement() {

  return (
    <Link href="/ui/form-errors">
      <div className=" block space-y-1.5 relative hover:bg-input/30 w-[calc(100%+1.25rem)] -translate-x-2.5 py-2.5 px-2.5 border border-border rounded hover:cursor-pointer transition-colors">
        <p className="font-medium leading-none underline-offset-4 hover:cursor-pointer">
          Handling Form Errors
        </p>
        <p className="flex gap-1.5 w-full text-muted-foreground">
          How to deal with different kind of form errors in UI
        </p>
      </div>
    </Link>
  );
}
