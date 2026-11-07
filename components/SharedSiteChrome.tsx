"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./BrandLogo";

type NavItem = readonly [string, string];

const solutions: readonly NavItem[] = [
  ["MT4 Grey Label", "mt4-grey-label"],
  ["MT5 Grey Label", "mt5-grey-label"],
  ["Forex Broker CRM", "forex-broker-crm"],
  ["PAMM & MAM Plugins", "pamm-mam"],
  ["Liquidity & Bridge", "forex-liquidity-bridge"],
  ["Broker Website", "forex-broker-website"],
];

const guides: readonly NavItem[] = [
  ["Start a Brokerage", "how-to-start-forex-brokerage"],
  ["Scale Your Brokerage", "scale-forex-brokerage"],
  ["Turnkey Brokerage", "turnkey-grey-label"],
];

const navItem =
  "inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 py-2 text-[.84rem] font-semibold leading-none text-slate-700 no-underline transition hover:bg-white/70 hover:text-slate-950 focus-visible:bg-white/80 focus-visible:text-slate-950";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
    >
      <path d="m5.5 7.5 4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuGroup({
  label,
  items,
  id,
  open,
  setOpen,
  onNavigate,
}: {
  label: string;
  items: readonly NavItem[];
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onNavigate: () => void;
}) {
  const desktop = () => typeof window !== "undefined" && window.innerWidth > 880;
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    if (!desktop()) return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  useEffect(() => () => cancelClose(), []);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (desktop() && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  return (
    <div
      className="relative w-auto max-[880px]:w-full"
      onMouseEnter={() => {
        if (!desktop()) return;
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocusCapture={() => desktop() && setOpen(true)}
      onBlur={handleBlur}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          if (!desktop()) setOpen(!open);
        }}
        className={`${navItem} w-full justify-between border-0 bg-transparent max-[880px]:border-b max-[880px]:border-slate-200/70`}
      >
        {label}
        <ChevronIcon open={open} />
      </button>

      <div
        id={id}
        className={[
          "absolute left-1/2 top-full z-[10000] grid min-w-[270px] -translate-x-1/2 gap-1 rounded-2xl border border-white/80 bg-white/82 p-2.5 shadow-[0_24px_70px_rgba(44,19,69,.18)] backdrop-blur-2xl transition duration-200",
          "max-[880px]:static max-[880px]:mt-1 max-[880px]:min-w-0 max-[880px]:translate-x-0 max-[880px]:border-slate-200/70 max-[880px]:bg-white/65 max-[880px]:shadow-none",
          open
            ? "visible pointer-events-auto opacity-100"
            : "invisible pointer-events-none opacity-0 max-[880px]:hidden",
        ].join(" ")}
      >
        {items.map(([name, slug]) => (
          <Link
            href={`/${slug}`}
            key={slug}
            onClick={onNavigate}
            className="flex min-h-11 items-center justify-between rounded-xl px-3.5 py-3 text-[.82rem] font-semibold text-slate-700 no-underline transition hover:bg-violet-50 hover:text-violet-800 focus-visible:bg-violet-50 focus-visible:text-violet-800"
          >
            <span>{name}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 text-violet-500" fill="none">
              <path d="M6 14 14 6m0 0H8m6 0v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SharedSiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<"solutions" | "guides" | null>(null);
  const path = usePathname();

  const close = () => {
    setMobileOpen(false);
    setExpanded(null);
  };

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);

  const active = (href: string) => path === href;

  return (
    <header data-site-header className="fixed inset-x-0 top-0 z-[9999] isolate px-3 py-3 sm:px-5">
      <div className="relative mx-auto flex min-h-[68px] w-full max-w-[1180px] items-center gap-3 rounded-[22px] border border-white/75 bg-white/78 px-3.5 shadow-[0_18px_55px_rgba(47,22,66,.16)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/68 sm:px-5">
        <Link href="/" className="shrink-0 text-slate-950" aria-label="MT4 Grey Label home">
          <BrandLogo className="h-11 w-[218px] max-[430px]:w-[176px]" />
        </Link>

        <button
          className="kg-global-menu ml-auto hidden size-11 min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-900 shadow-sm max-[880px]:inline-flex"
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          aria-controls="kg-primary-navigation"
          onClick={() => {
            setMobileOpen((value) => !value);
            setExpanded(null);
          }}
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none">
              <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <nav
          id="kg-primary-navigation"
          className={[
            "ml-auto flex flex-1 items-center justify-end gap-1",
            "max-[880px]:absolute max-[880px]:left-0 max-[880px]:right-0 max-[880px]:top-[calc(100%+10px)] max-[880px]:max-h-[calc(100dvh-105px)] max-[880px]:flex-col max-[880px]:items-stretch max-[880px]:gap-0 max-[880px]:overflow-y-auto max-[880px]:rounded-[20px] max-[880px]:border max-[880px]:border-white/80 max-[880px]:bg-white/88 max-[880px]:p-3 max-[880px]:shadow-[0_24px_70px_rgba(44,19,69,.2)] max-[880px]:backdrop-blur-2xl",
            mobileOpen ? "max-[880px]:flex" : "max-[880px]:hidden",
          ].join(" ")}
          aria-label="Primary navigation"
        >
          <Link
            href="/"
            aria-current={active("/") ? "page" : undefined}
            onClick={close}
            className={`${navItem} max-[880px]:w-full max-[880px]:justify-between ${active("/") ? "bg-violet-50 text-violet-800" : ""}`}
          >
            Home
          </Link>

          <MenuGroup
            label="Solutions"
            id="kg-solutions-menu"
            items={solutions}
            open={expanded === "solutions"}
            setOpen={(open) => setExpanded(open ? "solutions" : null)}
            onNavigate={close}
          />

          <MenuGroup
            label="Guides"
            id="kg-guides-menu"
            items={guides}
            open={expanded === "guides"}
            setOpen={(open) => setExpanded(open ? "guides" : null)}
            onNavigate={close}
          />

          <Link
            href="/about"
            aria-current={active("/about") ? "page" : undefined}
            onClick={close}
            className={`${navItem} max-[880px]:w-full max-[880px]:justify-between ${active("/about") ? "bg-violet-50 text-violet-800" : ""}`}
          >
            About
          </Link>
        </nav>

        <a
          data-get-started
          className="ml-2 inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d8c6ea] bg-[#f0e7fb] px-4 text-[.8rem] font-extrabold !text-[#4a1f5f] no-underline shadow-[0_10px_28px_rgba(74,31,95,.12)] transition hover:-translate-y-0.5 hover:border-[#c8ace4] hover:bg-white hover:shadow-[0_14px_34px_rgba(74,31,95,.16)] max-[880px]:hidden"
          href="mailto:admin@pincodeit.com?subject=MT4%20Grey%20Label%20Enquiry"
        >
          Get Started
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none">
            <path d="M6 14 14 6m0 0H8m6 0v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  );
}

export function SharedSiteFooter() {
  return (
    <footer className="h-fit border-t border-white/10 bg-[#0d0312] pb-7 pt-14 text-white">
      <div className="mx-auto w-[min(1180px,calc(100%_-_32px))]">
        <div data-site-footer-grid className="grid grid-cols-[1.35fr_1fr_1fr] gap-10 max-[720px]:grid-cols-2 max-[720px]:gap-x-5 max-[720px]:gap-y-7">
          <div className="max-[720px]:col-span-2">
            <Link href="/" className="inline-block text-white no-underline" aria-label="MT4 Grey Label home">
              <BrandLogo tone="light" className="h-12 w-[230px]" />
            </Link>
            <p className="mt-5 max-w-[390px] text-sm leading-7 text-violet-100/70">
              MT4 & MT5 grey label solutions, CRM, PAMM/MAM plugins, liquidity connectivity and broker websites.
            </p>
          </div>

          <div data-footer-menu="solutions" className="min-w-0">
            <strong className="mb-4 block text-sm font-extrabold">Solutions</strong>
            <div className="grid gap-2.5">
              {solutions.slice(0, 4).map(([name, slug]) => (
                <Link
                  className="w-fit text-sm font-medium text-violet-100/70 no-underline transition hover:text-white"
                  href={`/${slug}`}
                  key={slug}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          <div data-footer-menu="explore" className="min-w-0">
            <strong className="mb-4 block text-sm font-extrabold">Explore</strong>
            <div className="grid gap-2.5">
              {guides.map(([name, slug]) => (
                <Link
                  className="w-fit text-sm font-medium text-violet-100/70 no-underline transition hover:text-white"
                  href={`/${slug}`}
                  key={slug}
                >
                  {name}
                </Link>
              ))}
              <Link className="w-fit text-sm font-medium text-violet-100/70 no-underline transition hover:text-white" href="/about">
                About & Why Choose Us
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-5 text-xs leading-5 text-violet-100/55">
          <span>© 2026 MT4 Grey Label. Technology services only — not investment advice.</span>
        </div>
      </div>
    </footer>
  );
}
