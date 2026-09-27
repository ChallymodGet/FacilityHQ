import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { InspectionsProvider } from "@/lib/store";
import { THEME_INIT_SCRIPT } from "@/lib/theme-script";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FacilityHQ — Facility Housekeeping Inspections",
  description: "Sunbeth Global Concepts facility housekeeping inspection system",
  applicationName: "FacilityHQ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fe5a08",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <InspectionsProvider>{children}</InspectionsProvider>
      </body>
    </html>
  );
}
