import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { InspectionsProvider } from "@/lib/store";

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
    <html lang="en" className={`${hostGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <InspectionsProvider>{children}</InspectionsProvider>
      </body>
    </html>
  );
}
