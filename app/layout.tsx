import type { Metadata } from "next";
import "./globals.css";
import "./site-pages.css";
import { SharedSiteFooter, SharedSiteHeader } from "@/components/SharedSiteChrome";
import { SharedClosingSections } from "@/components/SharedClosingSections";
import { SiteMotion } from "@/components/SiteMotion";

export const metadata: Metadata = {
  title: { default: "MT4 Grey Label | Brokerage Technology", template: "%s | MT4 Grey Label" },
  description: "MT4 Grey Label brokerage technology for MT4 and MT5, broker CRM, PAMM/MAM, liquidity connectivity and broker websites.",
  applicationName: "MT4 Grey Label",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/brand/mt4-grey-label-icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/brand/mt4-grey-label-icon.svg",
    apple: "/brand/mt4-grey-label-icon.svg",
  },
  openGraph: {
    title: "MT4 Grey Label | Brokerage Technology",
    description: "Connected MT4 and MT5 brokerage technology, CRM, PAMM/MAM, liquidity and broker website solutions.",
    siteName: "MT4 Grey Label",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en">
    <body>
      <a
        href="#main-content"
        className="sr-only z-[1000] rounded-md bg-white px-4 py-3 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <SharedSiteHeader />
      <SiteMotion />
      <div id="main-content">{children}</div>
      <SharedClosingSections />
      <SharedSiteFooter />
    </body>
  </html>;
}
