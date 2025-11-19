import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import Footer from "@/components/layout/footer";
import { geist, geistMono } from "@/lib/fonts";
import { generateMetadata } from "@/lib/metadata";
import { Toaster } from "@/components/ui/sonner";

export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
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