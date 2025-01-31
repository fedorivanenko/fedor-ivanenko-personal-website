import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import { LazyMotion, domAnimation } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { WindowObserver } from "@/hooks/use-window-observer";
import { PointerObserver } from "@/hooks/use-pointer-observer";
import HoverPeeker from "@/components/hover-peeker";

const geistSans = localFont({
  src: "../public/font/Geist-variable.woff2",
  variable: "--font-geist-sans",
  preload: true,
});

const geistMono = localFont({
  src: "../public/font/GeistMono-variable.woff2",
  variable: "--font-geist-mono",
  preload: true,
});

export const metadata: Metadata = {
  title: "Fedor Ivanenko",
  description: "Design Engineering",
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans font-[350] min-h-screen flex flex-col max-w-[682px] mx-auto px-5 py-5 md:py-10 text-foreground antialiased`}
      >
        <LazyMotion features={domAnimation}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <HoverPeeker/>
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </LazyMotion>
        <WindowObserver />
        <PointerObserver />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
