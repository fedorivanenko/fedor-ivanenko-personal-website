import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import { LazyMotion, domAnimation } from "motion/react";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';

import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

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
            <Header/>
            {children}
          </ThemeProvider>
          <Footer/>
        </LazyMotion>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
