import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FigmaLogoIcon } from "@radix-ui/react-icons";
//import { Separator } from "../../../components/ui/separator";

export default function DesignBitsPanel() {
  return (
    <div className="space-y-1.5">
      <h2 className="mr-auto font-medium">Design Bits</h2>
      <p className="text-muted-foreground pb-5 leading-relaxed">
        Singular UI elements and random bits of visuals
      </p>
      <div className="flex flex-col">
        <div className="space-y-1.5 w-[calc(100%+1.25rem)] -translate-x-2.5 p-2.5 border border-border rounded">
          <Image
            priority={true}
            width={1280}
            height={640}
            src="/cashflow-chart-window-default.webp"
            alt="Bank Account Balance Chart"
            className="border border-border/20 rounded"
          />
        </div>
        <div className="flex flex-col mt-4 space-y-1 relative">
          <h3 className="font-medium leading-none underline-offset-4">
            Bank Account Balance Chart
          </h3>
          <Button 
          className="h-5 px-0" variant="default" size="tiny" asChild>
            <Link
              href="https://www.figma.com/design/6kWH882PVQXtAoj2VUUMYI/Budget-Forecaster?node-id=323-87&t=iyG9Fk67NflZNvSh-1"
              target="_blank"
              className="whitespace-nowrap flex pr-2 absolute -top-1.5 right-0"
            >
              <FigmaLogoIcon
                style={{ width: "12px", height: "12px" }}
                className="translate-x-1"
              />
              <span>Figma</span>
            </Link>
          </Button>
          <p className="flex gap-1.5 w-full text-muted-foreground">
            Part of the prototyping and visual research for an ongoing personal
            project
          </p>
        </div>
      </div>
    </div>
  );
}
