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

const SUPPORT_EMAIL = "support@fxgreylabel.com";
const SUPPORT_PHONE = "+447452191901";
const WHATSAPP_URL = "https://wa.me/447452191901";
const TELEGRAM_URL = "https://t.me/+447452191901";

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5" fill="none"><path d="M20 11.6a8 8 0 0 1-11.8 7l-4.2 1.1 1.1-4.1A8 8 0 1 1 20 11.6Z" stroke="currentColor" strokeWidth="1.8"/><path d="M8.3 7.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.5l.7 1.7c.1.3.1.5-.1.7l-.5.7c-.2.2-.1.4 0 .6.5.9 1.2 1.7 2.1 2.3.3.2.5.2.7 0l.8-1c.2-.2.4-.3.7-.2l1.7.8c.3.2.5.3.5.5 0 .5-.2 1.3-.6 1.8-.5.6-1.3.9-2.1.9-1 0-2.3-.4-4-1.5-2.1-1.4-3.5-3.5-3.9-4.2-.4-.8-1-2.1-1-3.4 0-1.2.6-1.8 1-2.2.2-.2.5-.3.7-.3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function TelegramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5" fill="none"><path d="m20.4 4.2-3 15.1c-.2 1-1 1.2-1.8.8l-4.6-3.4-2.2 2.1c-.2.2-.5.5-.9.5l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L5.6 13.3 1 11.9c-1-.3-1-1 .2-1.5l18-6.9c.8-.3 1.5.2 1.2.7Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round"/></svg>;
}
function ArrowUpIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5" fill="none"><path d="M10 16V4m0 0L5.5 8.5M10 4l4.5 4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

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

  const normalizePath = (value: string) => value === "/" ? "/" : value.replace(/\/+$/, "");
  const active = (href: string) => normalizePath(path) === normalizePath(href);

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

          <Link
            href="/contact"
            aria-current={active("/contact") ? "page" : undefined}
            onClick={close}
            className={`${navItem} max-[880px]:w-full max-[880px]:justify-between ${active("/contact") ? "bg-violet-50 text-violet-800" : ""}`}
          >
            Contact
          </Link>
          <div data-header-social className="ml-1 flex items-center gap-1.5 max-[880px]:mt-2 max-[880px]:w-full max-[880px]:border-t max-[880px]:border-slate-200/70 max-[880px]:pt-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp +447452191901" className="grid size-9 place-items-center rounded-xl border border-emerald-200/80 bg-emerald-50 text-emerald-700 no-underline transition hover:-translate-y-0.5 hover:bg-emerald-100 max-[880px]:flex-1"><WhatsAppIcon /></a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" aria-label="Telegram +447452191901" className="grid size-9 place-items-center rounded-xl border border-sky-200/80 bg-sky-50 text-sky-700 no-underline transition hover:-translate-y-0.5 hover:bg-sky-100 max-[880px]:flex-1"><TelegramIcon /></a>
          </div>
        </nav>

        <Link
          data-get-started
          className="ml-2 inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d8c6ea] bg-[#f0e7fb] px-4 text-[.8rem] font-extrabold !text-[#4a1f5f] no-underline shadow-[0_10px_28px_rgba(74,31,95,.12)] transition hover:-translate-y-0.5 hover:border-[#c8ace4] hover:bg-white hover:shadow-[0_14px_34px_rgba(74,31,95,.16)] max-[880px]:hidden"
          href="/contact"
        >
          Get Started
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none">
            <path d="M6 14 14 6m0 0H8m6 0v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </header>
  );
}

export function SharedSiteFooter() {
  return (
    <footer className="h-fit border-t border-white/10 bg-[#0d0312] pb-6 pt-10 text-white">
      <div className="mx-auto w-[min(1180px,calc(100%_-_32px))]">
        <div data-site-footer-grid className="grid grid-cols-[1.25fr_.8fr_.8fr_1fr] gap-7 max-[900px]:grid-cols-2 max-[720px]:gap-x-5 max-[720px]:gap-y-6">
          <div className="max-[900px]:col-span-2">
            <Link href="/" className="inline-block text-white no-underline" aria-label="MT4 Grey Label home">
              <BrandLogo tone="light" className="h-12 w-[230px]" />
            </Link>
            <p className="mt-4 max-w-[390px] text-sm leading-[1.55] text-violet-100/70">
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
              <Link className="w-fit text-sm font-medium text-violet-100/70 no-underline transition hover:text-white" href="/contact">
                Contact Us
              </Link>
            </div>
          </div>
          <div data-footer-contact className="min-w-0 max-[720px]:col-span-2">
            <strong className="mb-4 block text-sm font-extrabold">Contact</strong>
            <div className="grid gap-2.5 text-sm">
              <a href={`mailto:${SUPPORT_EMAIL}`} className="w-fit break-all font-medium text-violet-100/70 no-underline transition hover:text-white">{SUPPORT_EMAIL}</a>
              <a href={`tel:${SUPPORT_PHONE}`} className="w-fit font-medium text-violet-100/70 no-underline transition hover:text-white">{SUPPORT_PHONE}</a>
              <div className="mt-1 flex gap-2">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp +447452191901" className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/6 text-emerald-300 no-underline transition hover:bg-white/10 hover:text-emerald-200"><WhatsAppIcon /></a>
                <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" aria-label="Telegram +447452191901" className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/6 text-sky-300 no-underline transition hover:bg-white/10 hover:text-sky-200"><TelegramIcon /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-xs leading-5 text-violet-100/55">
          <span>© 2026 MT4 Grey Label. Technology services only — not investment advice.</span>
        </div>
      </div>
    </footer>
  );
}

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 520);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <button data-scroll-top type="button" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={`fixed bottom-5 right-4 z-[9998] grid size-11 place-items-center rounded-full border border-white/70 bg-white/88 text-violet-800 shadow-[0_16px_45px_rgba(39,17,55,.22)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:bg-white sm:right-5 ${visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"}`}><ArrowUpIcon /></button>;
}
