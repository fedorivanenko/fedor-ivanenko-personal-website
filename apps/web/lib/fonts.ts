import localFont from "next/font/local";

export const commit = localFont({
  src: [
    {
      path: "../public/fonts/CommitMono-400-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-commit",
  display: "block",
});
