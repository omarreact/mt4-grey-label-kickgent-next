import type { Metadata } from "next";
import "./globals.css";
import "./site-pages.css";
import { SharedSiteFooter, SharedSiteHeader } from "@/components/SharedSiteChrome";
import { SiteMotion } from "@/components/SiteMotion";

export const metadata: Metadata = {
  title: { default: "MT4 & MT5 Grey Label Solutions", template: "%s | GreyLabel" },
  description: "MT4 and MT5 Grey Label solutions, broker CRM, PAMM/MAM and liquidity connectivity.",
  applicationName: "GreyLabel Technology",
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
      <SharedSiteFooter />
    </body>
  </html>;
}
