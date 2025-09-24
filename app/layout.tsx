import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import Footer from "@/components/layout/footer";
import { geist } from "@/lib/fonts";
import { GsapAnimator } from "@/components/motion/gsap-animator";

export const metadata: Metadata = {
  title: "Fedor Ivanenko",
  description: "React / Next.js developer and UX designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
      </head>
      */}
      <body
        className={`${geist.variable} min-h-screen flex flex-col mx-auto max-w-screen-md py-5 pt-20 md:pt-40 text-foreground antialiased`}
      >
        <GsapAnimator />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
