import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Link from "next/link";



export default function Footer() {
  return (
    <div className="flex gap-1.5 w-[calc(100%+0.375rem)] -translate-x-1.5 text-sm text-border items-center mt-auto">
      <Button size="tiny" variant="ghost" asChild>
        <Link target="_blank" href="https://github.com/fedorivanenko">
          <GitHubLogoIcon style={{ width: "12px", height: "12px" }} /> GitHub
        </Link>
      </Button>
      <span>2025 © fedor.studio</span>
      <span className="ml-auto">Ghost in a Shell</span>
    </div>
  );
}
