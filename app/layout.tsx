import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import Footer from "@/components/layout/footer";
import { geist, geistMono } from "@/lib/fonts";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      {/*
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
      </head>
      */}
      <body
        className="min-h-screen flex flex-col mx-auto max-w-screen-md my-5 mt-20 md:mt-40 text-foreground antialiased"
      >
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
