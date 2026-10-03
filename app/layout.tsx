import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WorldBackdrop } from "@/components/world-backdrop";
import { site } from "@/lib/site";
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
  metadataBase: new URL(site.url),
  title: {
    default: "Ringnest | Games on Roblox",
    template: "%s | Ringnest",
  },
  description: site.description,
  icons: {
    icon: "/brand/mark.jpg",
    apple: "/brand/icon.jpg",
  },
  openGraph: {
    title: "Ringnest",
    description: site.description,
    url: site.url,
    siteName: "Ringnest",
    images: [{ url: "/brand/banner.jpg", width: 1280, height: 720, alt: "Ringnest" }],
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${heading.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col font-sans text-foreground">
        <WorldBackdrop />
        <SiteHeader />
        <main className="relative flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
