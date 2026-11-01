import localFont from "next/font/local";

export const serverMono = localFont({
  src: [
    {
      path: "../public/fonts/ServerMono-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ServerMono-RegularOblique.woff",
      weight: "400",
      style: "oblique",
    },
  ],
  variable: "--font-server-mono",
  display: "block",
});
