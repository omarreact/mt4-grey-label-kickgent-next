"use client";

import Link from "next/link";
import { useState } from "react";
import { navigation } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="siteHeader"><div className="shell headerInner">
    <Link className="brand" href="/"><i aria-hidden />GreyLabel</Link>
    <button className="menuButton" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="primary-nav">Menu</button>
    <nav id="primary-nav" className={open ? "navigation isOpen" : "navigation"} aria-label="Main navigation">
      <Link href="/" onClick={() => setOpen(false)}>Home</Link>
      <div className="navGroup"><span>Solutions</span><div className="dropPanel">{navigation.solutions.map(([label, slug]) => <Link href={`/${slug}`} key={slug} onClick={() => setOpen(false)}>{label}</Link>)}</div></div>
      <div className="navGroup"><span>Guides</span><div className="dropPanel">{navigation.guides.map(([label, slug]) => <Link href={`/${slug}`} key={slug} onClick={() => setOpen(false)}>{label}</Link>)}</div></div>
      <Link href="/about" onClick={() => setOpen(false)}>About</Link>
    </nav>
    <a className="button compactCta" href="mailto:admin@pincodeit.com?subject=GreyLabel%20Enquiry">Get Started <b>↗</b></a>
  </div></header>;
}
