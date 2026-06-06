import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import Footer from "@/components/layout/footer";
import { akzidenz, commit, sonne, thie } from "@/lib/fonts";
import { generateMetadata } from "@/lib/metadata";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

export const metadata : Metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${akzidenz.variable} ${sonne.variable} ${thie.variable} ${commit.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster/>
          <main>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
