import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "GreyLabel | Brokerage technology", template: "%s | GreyLabel" }, description: "Connected technology and launch guidance for forex brokers." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
