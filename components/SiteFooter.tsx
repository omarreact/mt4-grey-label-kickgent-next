import Link from "next/link";

export function SiteFooter() {
  return <footer className="footer"><div className="shell footerGrid"><div><Link className="brand footerBrand" href="/"><i />GreyLabel</Link><p>A connected home for brokerage technology, launch guidance and ongoing growth.</p></div><div><strong>Start a conversation</strong><a href="mailto:admin@pincodeit.com">admin@pincodeit.com</a><a href="/how-to-start-forex-brokerage">Brokerage launch guide</a></div></div><div className="shell copyright">© 2026 GreyLabel. Technology and infrastructure guidance for forex brokers.</div></footer>;
}
