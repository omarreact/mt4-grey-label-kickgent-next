import type { Metadata } from "next";
import "./site-pages.css";
import { SharedSiteFooter, SharedSiteHeader } from "@/components/SharedSiteChrome";

export const metadata: Metadata = {
  title: { default: "MT4 & MT5 Grey Label Solutions", template: "%s | GreyLabel" },
  description: "MT4 and MT5 Grey Label solutions, broker CRM, PAMM/MAM and liquidity connectivity.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SharedSiteHeader />{children}<SharedSiteFooter /></body></html>;
}
