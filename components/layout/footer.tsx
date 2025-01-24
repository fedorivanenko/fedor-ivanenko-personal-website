import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Link from "next/link";



export default function Footer() {
  return (
    <div className="flex flex-col sm:flex-row gap-1.5 w-[calc(100%+0.375rem)] -translate-x-1.5 text-sm text-border sm:items-center mt-auto relative">
      <Button size="tiny" variant="ghost" asChild className="absolute bottom-0 right-0 sm:relative">
        <Link target="_blank" href="https://github.com/fedorivanenko">
          <GitHubLogoIcon style={{ width: "12px", height: "12px" }} /> GitHub
        </Link>
      </Button>
      <span>2025 © fedor.studio</span>
      <span className="sm:ml-auto">Ghost in a Shell</span>
    </div>
  );
}
