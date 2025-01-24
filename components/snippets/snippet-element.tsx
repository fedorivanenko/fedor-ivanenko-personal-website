import Link from "next/link";

{
  /*
  import { ArrowTopRightIcon } from "@radix-ui/react-icons";
  import { Badge } from "../ui/badge";
  const techs = [
    "React.useFormState",
    "@motion",
    "@react-hook-form",
    "@zod",
    "@shadcn/ui",
  ];
   */
}

export default function SnippetElement() {
  return (
    <Link href="/ui/form-errors">
      <div className=" block space-y-1.5 relative hover:bg-input/30 w-[calc(100%+1.25rem)] -translate-x-2.5 py-2 px-2.5">
        {/*
        <div className="flex text-sm space-x-3 w-full">
          {techs.map((tech) => (
            <Badge key={tech} variant="ghost">
              {tech}
            </Badge>
          ))}
        </div>
       */}
        <div className="flex items-center">
          <p className="font-medium leading-none underline-offset-4 hover:cursor-pointer">
            Form Errors
          </p>
        </div>
        <p className="flex gap-1.5 w-full text-muted-foreground">
          How to deal with different kind of form errors in UI
        </p>
        {/*
      <span className="absolute top-0 right-2.5 z-10">
        <ArrowTopRightIcon style={{ width: "15px", height: "15px" }} />
      </span>
         */}
      </div>
    </Link>
  );
}
