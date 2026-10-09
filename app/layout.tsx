import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { FreshLoad } from "@/components/fresh-load";
import { MobileAppShell } from "@/components/mobile-app-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WorldBackdrop } from "@/components/world-backdrop";
import { site } from "@/lib/site";
import { NexovixConnectGtmNoscript, NexovixConnectTracking } from "../components/nexovix-connect-tracking";
import "./globals.css";

const heading = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  verification: {
    google: "AYGb6umf3Vy8cJaKmzcdG-OtNyjXRTyz4bZQjOY_Kaw",
  },
  alternates: { canonical: "/" },
  description: "Ringnest makes games on Roblox. Play Pet Orbits: crash orbits, hatch 162 pets, run 12 biome nests, and come back for daily quests and offline pens.",
  metadataBase: new URL(site.url),
  title: {
    default: "Ringnest | Games on Roblox",
    template: "%s | Ringnest",
  },
  description: site.description,
  applicationName: "Ringnest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ringnest",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: `/favicon.ico?v=${site.assetVersion}`, sizes: "any" },
      { url: `/icons/favicon-32.png?v=${site.assetVersion}`, sizes: "32x32", type: "image/png" },
      { url: `/icons/favicon-48.png?v=${site.assetVersion}`, sizes: "48x48", type: "image/png" },
      { url: `/icons/icon-192.png?v=${site.assetVersion}`, sizes: "192x192", type: "image/png" },
      { url: `/icons/icon-512.png?v=${site.assetVersion}`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: `/apple-touch-icon.png?v=${site.assetVersion}`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [`/favicon.ico?v=${site.assetVersion}`],
  },
  manifest: `/manifest.webmanifest?v=${site.assetVersion}`,
  openGraph: {
    title: "Ringnest",
    description: site.description,
    url: site.url,
    siteName: "Ringnest",
    images: [{ url: "/brand/banner.jpg", width: 1280, height: 720, alt: "Ringnest" }],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050814",
  width: "device-width",
  initialScale: 1,
  /* Allow pinch-zoom so readers can enlarge text on any device. */
  maximumScale: 5,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${heading.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="app-shell relative min-h-full flex flex-col font-sans text-foreground">
        <NexovixConnectGtmNoscript />
        <FreshLoad />
        <WorldBackdrop />
        <SiteHeader />
        <main className="relative flex-1 pb-[calc(7.25rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
        <SiteFooter />
        <MobileAppShell />
              <NexovixConnectTracking />
      </body>
    </html>
  );
}
