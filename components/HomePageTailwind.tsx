"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const heroSlides = [
  {
    id: "launch",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=2200&q=88",
    label: "Brokerage launch",
    badge: "MT4 & MT5 BROKERAGE TECHNOLOGY",
    title: "Launch a brokerage.",
    titleAccent: "Connect every system.",
    description:
      "MT4 and MT5 grey label, CRM, PAMM and MAM plugins, liquidity connectivity and broker websites, brought together by one technology partner.",
    primary: { label: "Explore solutions", href: "#solutions" },
    secondary: { label: "See how it works", href: "#how-it-works" },
    assistantTitle: "Ready to launch.",
    assistantText: "Choose the systems you want connected first.",
    assistantChips: ["MT5 setup", "CRM workflow"],
    progressLabel: "Brokerage launch",
    progressValue: 64,
    progressClass: "w-[64%]",
    progressText: "Configuration aligned",
    systemsLabel: "Connected systems",
    systems: ["Client onboarding", "PAMM / MAM", "Liquidity bridge"],
  },
  {
    id: "operations",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2200&q=88",
    label: "Connected operations",
    badge: "CONNECTED BROKER OPERATIONS",
    title: "Run every client journey.",
    titleAccent: "From one connected stack.",
    description:
      "Bring onboarding, KYC, funding, trading accounts and partner operations into a workflow where every hand-off stays visible.",
    primary: { label: "Explore broker CRM", href: "/forex-broker-crm" },
    secondary: { label: "Explore MT5", href: "/mt5-grey-label" },
    assistantTitle: "Operations synchronized.",
    assistantText: "Your CRM, accounts and payment states stay in context.",
    assistantChips: ["KYC approved", "Account provisioned"],
    progressLabel: "Client activation",
    progressValue: 82,
    progressClass: "w-[82%]",
    progressText: "Workflow automated",
    systemsLabel: "Live workflow",
    systems: ["KYC & payments", "Trading accounts", "IB attribution"],
  },
  {
    id: "scale",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2200&q=88",
    label: "Brokerage growth",
    badge: "SCALE WITHOUT FRAGMENTATION",
    title: "Add products and capacity.",
    titleAccent: "Keep the stack coherent.",
    description:
      "Expand managed accounts, liquidity, client acquisition and infrastructure without turning each new capability into a disconnected system.",
    primary: { label: "Scale your brokerage", href: "/scale-forex-brokerage" },
    secondary: { label: "Explore PAMM / MAM", href: "/pamm-mam" },
    assistantTitle: "Ready to scale.",
    assistantText: "Add capacity without rebuilding the operational core.",
    assistantChips: ["PAMM / MAM", "New liquidity"],
    progressLabel: "Growth readiness",
    progressValue: 91,
    progressClass: "w-[91%]",
    progressText: "Expansion mapped",
    systemsLabel: "Growth stack",
    systems: ["Managed accounts", "Liquidity routing", "Client growth"],
  },
] as const;

const partnerPortraits = [
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&h=240&q=88",
    alt: "Portrait of a brokerage technology partner",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=88",
    alt: "Portrait of a brokerage operations partner",
  },
  {
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&h=240&q=88",
    alt: "Portrait of a fintech implementation partner",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=88",
    alt: "Portrait of a brokerage infrastructure partner",
  },
];

const platformCards = [
  {
    title: "MT4 Grey Label",
    text: "Launch on a familiar trading platform with branded client terminals, manager access and account-group configuration.",
    icon: "terminal",
  },
  {
    title: "MT5 Grey Label",
    text: "Add multi-asset capability, modern order types and a scalable platform for brokers building beyond forex-only workflows.",
    icon: "layers",
  },
  {
    title: "Forex Broker CRM",
    text: "Bring registration, KYC, payments, client accounts and partner management into one connected operational layer.",
    icon: "crm",
  },
  {
    title: "PAMM / MAM",
    text: "Support professional money managers with allocation, investor reporting and fee workflows connected to your brokerage stack.",
    icon: "allocation",
  },
  {
    title: "Liquidity & Bridge",
    text: "Connect trading platforms to liquidity providers with routing, failover and execution workflows aligned to your model.",
    icon: "bridge",
  },
] as const;

const journeySteps = [
  {
    title: "Registration",
    label: "Lead → verified client",
    text: "Capture the lead, create the client record and collect the identity information your onboarding workflow needs.",
    icon: "user",
  },
  {
    title: "KYC & funding",
    label: "Verified → funded",
    text: "Move approved clients into deposits and payment confirmation without forcing your operations team to re-enter data.",
    icon: "verify",
  },
  {
    title: "Trading account",
    label: "Funded → trading",
    text: "Create MT4 or MT5 accounts through the manager API, assign groups and deliver credentials from the connected CRM.",
    icon: "account",
  },
  {
    title: "Retention",
    label: "Trading → growing",
    text: "Keep account activity, partner attribution, reporting and support context visible as the client relationship expands.",
    icon: "growth",
  },
] as const;

const solutionSlides = [
  { title: "MT4 Grey Label", text: "A branded MT4 environment with manager access, group configuration and broker integrations.", href: "/mt4-grey-label", icon: "terminal" },
  { title: "MT5 Grey Label", text: "A modern multi-asset platform setup with CRM, liquidity and operational connectivity.", href: "/mt5-grey-label", icon: "layers" },
  { title: "Forex Broker CRM", text: "Client onboarding, KYC, payments, trading accounts and IB management in one back office.", href: "/forex-broker-crm", icon: "crm" },
  { title: "PAMM & MAM Plugins", text: "Managed-account tooling for allocation, fees, investors and reporting.", href: "/pamm-mam", icon: "allocation" },
  { title: "Liquidity & Bridge", text: "Execution connectivity designed around platform, provider and routing requirements.", href: "/forex-liquidity-bridge", icon: "bridge" },
  { title: "Broker Website", text: "A conversion-focused client-facing website connected to registration and platform journeys.", href: "/forex-broker-website", icon: "website" },
  { title: "Start a Brokerage", text: "A practical launch guide covering the platform, CRM, liquidity, website and infrastructure stack.", href: "/how-to-start-forex-brokerage", icon: "guide" },
  { title: "Scale Your Brokerage", text: "Automation, capacity, products and integrations for an operation that is already growing.", href: "/scale-forex-brokerage", icon: "scale" },
  { title: "Turnkey Brokerage", text: "Platform, CRM, liquidity, website and hosting delivered as one coordinated launch stack.", href: "/turnkey-grey-label", icon: "turnkey" },
  { title: "About MT4 Grey Label", text: "Our approach to implementation, integration, infrastructure and long-term technical support.", href: "/about", icon: "company" },
] as const;

const faqs = [
  ["Can I launch with both MT4 and MT5?", "Yes. Where the required platform arrangements are available, both can be connected to the same wider CRM and brokerage workflow."],
  ["Does the CRM connect to trading accounts automatically?", "A connected implementation can create and manage trading accounts through the relevant manager APIs instead of relying on repeated manual entry."],
  ["Can I add PAMM or MAM after launch?", "Yes. The stack is designed so additional products can be introduced later when the brokerage is ready operationally and legally."],
  ["Do you provide investment or brokerage services?", "No. GreyLabel Technology is positioned as a technology provider. Regulatory, licensing and investment decisions remain with the operating business and its advisers."],
];

const glass =
  "border border-white/20 bg-white/10 shadow-[0_20px_60px_rgba(10,3,20,.22)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/8";

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={`size-4 ${direction === "left" ? "rotate-180" : ""}`} fill="none">
      <path d="M4 10h12m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


function FeatureIcon({ name, className = "size-6" }: { name: string; className?: string }) {
  const common = { className, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;

  if (name === "terminal") return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M7 9h4m-4 4 2 2-2 2m5 0h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "layers") return <svg {...common}><path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Zm-9 9 9 4.5 9-4.5M3 16.5 12 21l9-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "crm") return <svg {...common}><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5M16 8h5m-5 4h5m-3 4h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if (name === "allocation") return <svg {...common}><path d="M5 19V9m7 10V5m7 14v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="5" cy="7" r="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="3" r="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="19" cy="10" r="2" stroke="currentColor" strokeWidth="1.8"/></svg>;
  if (name === "bridge") return <svg {...common}><path d="M4 18h16M6 18v-5m12 5v-5M5 13c1.8-4 4.1-6 7-6s5.2 2 7 6M12 7V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "website") return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if (name === "guide") return <svg {...common}><path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M8 8h6m-6 4h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if (name === "scale" || name === "growth") return <svg {...common}><path d="M4 18 10 12l4 3 6-8M15 7h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "turnkey") return <svg {...common}><circle cx="9" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M13 12h8m-3 0v3m-3-3v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if (name === "company") return <svg {...common}><path d="M4 20V7l8-4 8 4v13M8 10h2m4 0h2m-8 4h2m4 0h2m-5 6v-3h2v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "user") return <svg {...common}><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if (name === "verify") return <svg {...common}><path d="M12 3 19 6v5c0 4.3-2.7 7.8-7 10-4.3-2.2-7-5.7-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m8.5 12 2.2 2.2 4.8-4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "account") return <svg {...common}><rect x="4" y="5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M8 9h8M8 13h5m-5 3h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  return <svg {...common}><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

export function HomePageTailwind() {
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const heroTransitionRef = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const activeHero = heroSlides[heroSlide];

  const selectHeroSlide = (next: number) => {
    if (next === heroSlide || !heroVisible) return;
    setHeroVisible(false);
    if (heroTransitionRef.current !== null) window.clearTimeout(heroTransitionRef.current);
    heroTransitionRef.current = window.setTimeout(() => {
      setHeroSlide(next);
      setHeroVisible(true);
      heroTransitionRef.current = null;
    }, 220);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroVisible(false);
      if (heroTransitionRef.current !== null) window.clearTimeout(heroTransitionRef.current);
      heroTransitionRef.current = window.setTimeout(() => {
        setHeroSlide((current) => (current + 1) % heroSlides.length);
        setHeroVisible(true);
        heroTransitionRef.current = null;
      }, 220);
    }, 6500);

    return () => {
      window.clearInterval(timer);
      if (heroTransitionRef.current !== null) window.clearTimeout(heroTransitionRef.current);
    };
  }, []);

  const scrollSolutions = (direction: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({
      left: direction * Math.max(280, slider.clientWidth * 0.78),
      behavior: "smooth",
    });
  };

  const activeJourney = journeySteps[journeyIndex];
  const journeyProgress = ["w-1/4", "w-1/2", "w-3/4", "w-full"][journeyIndex];

  return (
    <main className="overflow-hidden bg-[#100414] text-white">
      <section
        data-hero-banner
        data-active-slide={activeHero.id}
        className="relative isolate h-fit overflow-hidden px-4 pb-10 pt-[112px] text-white sm:px-6 sm:pt-[122px] md:min-h-[760px] md:py-[104px] xl:min-h-[690px]"
      >
        <div className="pointer-events-none absolute inset-0 -z-30" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              src={slide.image}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${index === heroSlide ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 -z-20 bg-slate-950/42 backdrop-blur-[1.5px]" />
        <div className="pointer-events-none absolute inset-x-[5%] top-[15%] -z-10 hidden h-[68%] rounded-[50%] border border-white/20 md:block" />

        <div data-hero-frame className="relative mx-auto h-fit w-full max-w-[1480px] overflow-hidden rounded-[38px] border border-white/20 bg-slate-950/30 p-4 shadow-[0_30px_90px_rgba(15,23,42,.24)] backdrop-blur-xl sm:p-6 md:min-h-[620px] md:p-5 lg:min-h-[580px] xl:min-h-[560px] xl:p-7">
          <div
            data-hero-left
            data-hero-scene={activeHero.id}
            aria-live="polite"
            className={`h-fit min-w-0 rounded-[28px] border border-white/14 bg-white/[.045] p-5 text-left transition-all duration-500 sm:p-7 md:flex md:min-h-[580px] md:w-[52%] md:flex-col md:justify-center md:border-0 md:bg-transparent md:p-5 lg:min-h-[540px] lg:p-7 xl:min-h-[520px] xl:p-8 ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          >
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/35 bg-white/14 px-3.5 py-2 text-[.68rem] font-bold tracking-[.1em] text-white shadow-[0_10px_30px_rgba(15,23,42,.18)] backdrop-blur-2xl sm:text-xs">
              <span className="grid size-5 shrink-0 place-items-center rounded-full border border-white/40 bg-white/20">✦</span>
              <span className="min-w-0 break-words">{activeHero.badge}</span>
            </span>

            <h1 className="mt-6 max-w-[620px] text-balance text-[clamp(2.1rem,4.6vw,4.65rem)] font-semibold leading-[.96] tracking-[-.06em] text-white drop-shadow-[0_4px_22px_rgba(15,23,42,.48)] md:mt-4">
              {activeHero.title}
              <span className="block">{activeHero.titleAccent}</span>
            </h1>

            <p className="mt-5 max-w-[590px] text-pretty text-[.92rem] font-medium leading-7 text-white/88 drop-shadow-[0_3px_18px_rgba(15,23,42,.45)] sm:text-[1.03rem] md:mt-4 md:text-[.9rem] md:leading-6 lg:text-[1rem] lg:leading-7">
              {activeHero.description}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-5 md:gap-2.5">
              <Link
                href={activeHero.primary.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/18 px-5 text-sm font-extrabold text-white shadow-[0_15px_38px_rgba(15,23,42,.22)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/24"
              >
                {activeHero.primary.label} <ArrowIcon />
              </Link>
              <Link
                href={activeHero.secondary.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/12 px-5 text-sm font-bold text-white shadow-[0_12px_34px_rgba(15,23,42,.18)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                {activeHero.secondary.label} <ArrowIcon />
              </Link>
            </div>

            <div className="mt-5 flex items-center gap-2" role="tablist" aria-label="Banner slides">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-label={`Show ${slide.label} banner`}
                  aria-selected={heroSlide === index}
                  onClick={() => selectHeroSlide(index)}
                  className={`h-2.5 rounded-full border border-white/50 backdrop-blur-xl transition-all ${heroSlide === index ? "w-8 bg-white" : "w-2.5 bg-white/35 hover:bg-white/60"}`}
                />
              ))}
            </div>
          </div>

          <div
            data-hero-right
            data-hero-scene={activeHero.id}
            className={`relative mt-5 min-w-0 transition-all duration-500 md:absolute md:bottom-5 md:right-5 md:top-5 md:mt-0 md:w-[43%] xl:bottom-7 xl:right-7 xl:top-7 ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          >
            <div
              data-hero-float
              className="mx-auto w-[92%] max-w-[360px] rounded-[22px] bg-slate-950/24 p-4 text-left shadow-[0_22px_55px_rgba(15,23,42,.2)] backdrop-blur-2xl md:absolute md:left-[4%] md:top-[8%] lg:left-[8%] lg:top-[10%] lg:w-[78%] xl:left-[10%] xl:w-[72%]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/12 text-sm shadow-[0_8px_20px_rgba(15,23,42,.12)]">
                  ✦
                </span>
                <div className="min-w-0">
                  <span className="block break-words text-[10px] font-black uppercase tracking-[.14em] text-white/60">
                    {activeHero.label}
                  </span>
                  <strong className="mt-1 block break-words text-[1.2rem] font-semibold leading-tight tracking-[-.035em] text-white lg:text-[1.45rem] xl:text-[1.7rem]">
                    {activeHero.assistantTitle}
                  </strong>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/72 lg:text-sm lg:leading-6">
                {activeHero.assistantText}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeHero.assistantChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/85 backdrop-blur-xl"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div
              data-hero-float
              className="ml-auto mt-4 w-[88%] max-w-[320px] rounded-[20px] bg-slate-950/22 p-4 text-left shadow-[0_18px_44px_rgba(15,23,42,.18)] backdrop-blur-2xl md:absolute md:right-[2%] md:top-[43%] lg:right-[4%] lg:top-[45%] lg:w-[68%] xl:right-[6%] xl:w-[64%]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-black uppercase tracking-[.14em] text-white/60">
                  {activeHero.progressLabel}
                </span>
                <strong className="text-sm text-white">{activeHero.progressValue}%</strong>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-fuchsia-300 to-violet-300 transition-[width] duration-700 ${activeHero.progressClass}`}
                />
              </div>
              <p className="mt-2 text-xs text-white/70">{activeHero.progressText}</p>
            </div>

            <div
              data-hero-float
              className="mt-4 w-[92%] max-w-[330px] rounded-[20px] bg-slate-950/22 p-4 text-left shadow-[0_18px_44px_rgba(15,23,42,.18)] backdrop-blur-2xl md:absolute md:bottom-[6%] md:left-[2%] lg:bottom-[8%] lg:left-[5%] lg:w-[70%] xl:left-[8%] xl:w-[66%]"
            >
              <span className="text-[10px] font-black uppercase tracking-[.14em] text-white/60">
                {activeHero.systemsLabel}
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeHero.systems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/85 backdrop-blur-xl"
                  >
                    <span className="text-white/55">↗</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#18071f] px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {partnerPortraits.map((portrait) => (
                  <img
                    key={portrait.src}
                    src={portrait.src}
                    alt={portrait.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-11 rounded-full border-2 border-[#18071f] object-cover shadow-lg sm:size-12"
                  />
                ))}
              </div>
              <div>
                <strong className="block text-2xl font-black tracking-[-.05em]">4.8 / 5</strong>
                <span className="text-xs font-semibold text-fuchsia-200">★★★★★ average partner rating</span>
              </div>
            </div>

            <p className="mt-8 max-w-[560px] text-balance text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.08] tracking-[-.055em] text-violet-50">
              A brokerage that can offer the right platform under its own brand starts with an operational advantage.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["Configuration", "Integration", "Launch support"].map((item) => (
                <span key={item} className="rounded-full border border-white/12 bg-white/6 px-3.5 py-2 text-xs font-semibold text-violet-100/75 backdrop-blur-xl">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              ["MT4", "Familiar platform and existing EA ecosystem"],
              ["MT5", "Multi-asset workflows and newer trading tools"],
              ["CRM", "Onboarding, payments, accounts and partners"],
              ["24/7", "Technical continuity around the launch stack"],
            ].map(([metric, copy]) => (
              <article key={metric} className="rounded-[22px] border border-white/10 bg-white/[.055] p-5 backdrop-blur-xl sm:p-7">
                <strong className="text-[clamp(2rem,5vw,4rem)] font-semibold tracking-[-.08em]">{metric}</strong>
                <p className="mt-3 text-sm leading-6 text-violet-100/65">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="h-fit bg-[#f7f3fb] px-4 py-20 text-slate-950 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="text-xs font-extrabold tracking-[.18em] text-violet-700">MORE THAN A PLATFORM</span>
            <h2 className="mt-4 text-balance text-[clamp(2.5rem,5.2vw,4.8rem)] font-semibold leading-[1.02] tracking-[-.055em]">
              More systems than most founders expect
            </h2>
            <p className="mx-auto mt-5 max-w-[680px] text-base leading-8 text-slate-600">
              The trading platform is only one layer. A working brokerage needs client operations, managed accounts, execution connectivity and a client-facing experience around it.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            {platformCards.map((card) => (
              <article
                data-platform-card
                key={card.title}
                className="group relative h-fit min-w-0 grow basis-full overflow-hidden rounded-[26px] bg-white p-6 shadow-[0_18px_48px_rgba(59,35,83,.09)] ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(89,45,120,.14)] sm:basis-[calc(50%-0.5rem)] xl:basis-[calc(33.333%-0.75rem)]"
              >
                <FeatureIcon
                  name={card.icon}
                  className="pointer-events-none absolute -bottom-10 -right-8 size-40 text-violet-700 opacity-[.055] transition duration-500 group-hover:scale-110 group-hover:opacity-[.085]"
                />
                <span className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50 text-violet-700 shadow-[0_10px_30px_rgba(109,40,217,.12)]">
                  <FeatureIcon name={card.icon} className="size-7" />
                </span>
                <h3 className="relative mt-7 text-xl font-bold tracking-[-.035em] text-slate-950">{card.title}</h3>
                <p className="relative mt-3 max-w-[440px] text-sm leading-7 text-slate-600">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-active-journey className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
        <img
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2200&q=86"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-30 size-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-slate-950/48 backdrop-blur-[1.5px]" />
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="text-xs font-extrabold tracking-[.18em] text-fuchsia-200">ACTIVE CLIENT JOURNEY</span>
            <h2 className="mt-4 text-balance text-[clamp(2.6rem,5vw,4.8rem)] font-semibold leading-[1] tracking-[-.06em]">
              Turn four disconnected hand-offs into one visible workflow
            </h2>
            <p className="mx-auto mt-5 max-w-[690px] text-base leading-8 text-violet-100/65">
              Follow the client from first registration to an active trading relationship, while each system keeps the next team and next action in context.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
            <div className="grid gap-3" role="tablist" aria-label="Active client journey">
              {journeySteps.map((step, index) => {
                const selected = index === journeyIndex;
                return (
                  <button
                    key={step.title}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setJourneyIndex(index)}
                    className={[
                      "tab flex min-h-24 w-full items-center gap-4 rounded-[20px] border p-4 text-left transition sm:p-5",
                      selected
                        ? "border-fuchsia-300/45 bg-white/12 shadow-[0_16px_45px_rgba(81,25,115,.28)] backdrop-blur-2xl"
                        : "border-white/10 bg-white/[.045] hover:border-white/20 hover:bg-white/[.075]",
                    ].join(" ")}
                  >
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${selected ? "bg-fuchsia-200 text-violet-950" : "bg-white/8 text-violet-100/70"}`}>
                      <FeatureIcon name={step.icon} className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <strong className="block break-words text-base font-bold">{step.title}</strong>
                      <span className="mt-1 block break-words text-xs leading-5 text-violet-100/55">{step.label}</span>
                    </span>
                    <span className="ml-auto hidden text-fuchsia-200 sm:block">↗</span>
                  </button>
                );
              })}
            </div>

            <article
              role="tabpanel"
              className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[radial-gradient(circle_at_78%_18%,rgba(192,132,252,.3),transparent_34%),rgba(255,255,255,.055)] p-5 shadow-[0_28px_80px_rgba(8,2,14,.28)] backdrop-blur-2xl sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[.16em] text-fuchsia-200"><FeatureIcon name={activeJourney.icon} className="size-4" /> CONNECTED WORKFLOW</span>
                  <h3 className="mt-3 break-words text-3xl font-semibold tracking-[-.05em] sm:text-4xl">{activeJourney.title}</h3>
                  <p className="mt-4 max-w-[620px] text-sm leading-7 text-violet-100/70 sm:text-base">{activeJourney.text}</p>
                </div>
                <span className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200 backdrop-blur-xl">
                  Live workflow
                </span>
              </div>

              <div className="mt-8 rounded-[22px] border border-white/15 bg-[#12051a]/45 p-4 backdrop-blur-2xl sm:p-5">
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-300 transition-all duration-500 ${journeyProgress}`} />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["CRM event", activeJourney.label],
                    ["Next owner", journeyIndex < 2 ? "Client operations" : "Retention & support"],
                    ["Automation", journeyIndex === 0 ? "Create client profile" : journeyIndex === 1 ? "Confirm funding state" : journeyIndex === 2 ? "Provision trading access" : "Track engagement"],
                    ["Visibility", "Status shared across the connected stack"],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0 rounded-xl border border-white/10 bg-white/[.055] p-4">
                      <span className="block text-[10px] font-black uppercase tracking-[.14em] text-violet-100/45">{label}</span>
                      <strong className="mt-2 block break-words text-sm leading-6 text-violet-50">{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="h-fit bg-[#f7f3fb] px-4 py-20 text-slate-950 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[780px]">
              <span className="text-xs font-extrabold tracking-[.18em] text-violet-700">EXPLORE EVERY SOLUTION</span>
              <h2 className="mt-4 text-balance text-[clamp(2.5rem,5vw,4.6rem)] font-semibold leading-[1.02] tracking-[-.055em]">
                The complete brokerage technology library
              </h2>
              <p className="mt-5 max-w-[690px] text-base leading-8 text-slate-600">
                Browse the platform, operations, growth and implementation pages as an interactive solution track.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollSolutions(-1)}
                aria-label="Previous solutions"
                className="grid size-12 place-items-center rounded-full bg-white text-slate-800 shadow-[0_10px_28px_rgba(52,30,74,.08)] ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-violet-700"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={() => scrollSolutions(1)}
                aria-label="Next solutions"
                className="grid size-12 place-items-center rounded-full bg-slate-950 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-800"
              >
                <ArrowIcon />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            role="region"
            aria-label="GreyLabel solution carousel"
            className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {solutionSlides.map((slide) => (
              <Link
                data-solution-card
                key={slide.title}
                href={slide.href}
                className="group relative h-fit min-w-0 shrink-0 basis-[86%] snap-start overflow-hidden rounded-[26px] bg-white p-6 text-slate-950 shadow-[0_18px_45px_rgba(52,30,74,.08)] ring-1 ring-slate-200/80 no-underline transition hover:-translate-y-1 hover:ring-violet-300 sm:basis-[48%] lg:basis-[31.5%]"
              >
                <FeatureIcon
                  name={slide.icon}
                  className="pointer-events-none absolute -bottom-12 -right-10 size-48 text-violet-700 opacity-[.055] transition duration-500 group-hover:scale-110 group-hover:opacity-[.09]"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50 text-violet-700 shadow-[0_10px_28px_rgba(109,40,217,.1)]">
                    <FeatureIcon name={slide.icon} className="size-7" />
                  </span>
                  <span className="grid size-10 place-items-center rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200 transition group-hover:bg-violet-50 group-hover:text-violet-700">
                    <ArrowIcon />
                  </span>
                </div>
                <h3 className="relative mt-10 text-2xl font-semibold tracking-[-.04em]">{slide.title}</h3>
                <p className="relative mt-4 text-sm leading-7 text-slate-600">{slide.text}</p>
                <span className="relative mt-7 inline-flex text-sm font-extrabold text-violet-700">Explore solution →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f0314] px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-5 lg:grid-cols-2">
          <article className="rounded-[28px] border border-white/10 bg-white/[.045] p-6 sm:p-8">
            <span className="text-xs font-extrabold tracking-[.16em] text-fuchsia-200">PLATFORM CHOICE</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.055em]">MT4 or MT5?</h2>
            <p className="mt-4 max-w-[520px] text-sm leading-7 text-violet-100/65">
              Many brokerages use the platforms for different client segments rather than treating the choice as permanent.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                ["MT4", "Familiar interface", "Established EA ecosystem", "Forex / CFD workflows"],
                ["MT5", "More timeframes", "Multi-asset capability", "Hedging and netting"],
              ].map(([title, ...points]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
                  <strong className="text-2xl tracking-[-.04em]">{title}</strong>
                  <ul className="mt-4 grid gap-2">
                    {points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-xs text-violet-100/65">
                        <span className="size-1.5 rounded-full bg-fuchsia-300" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(148,72,247,.18),rgba(255,255,255,.035))] p-6 sm:p-8">
            <span className="text-xs font-extrabold tracking-[.16em] text-fuchsia-200">THE FULL STACK</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.055em]">Every system speaking the same language</h2>
            <p className="mt-4 text-sm leading-7 text-violet-100/65">
              Launch the minimum viable stack, then add products and capacity without turning each addition into a separate technology island.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {["MT4 / MT5", "Broker CRM", "PAMM / MAM", "Liquidity"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/7 p-4 text-sm font-bold backdrop-blur-xl">{item}</div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#f7f3fb] px-4 py-20 text-slate-950 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="text-xs font-extrabold tracking-[.18em] text-violet-700">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-.06em]">Clear answers before you build</h2>
            <p className="mt-5 max-w-[480px] text-base leading-8 text-slate-600">
              Platform availability, integration scope and operational ownership should be understood before implementation begins.
            </p>
          </div>

          <div className="faq-list grid gap-3">
            {faqs.map(([question, answer], index) => (
              <details key={question} open={index === 0} className="group rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(52,30,74,.06)]">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-bold marker:hidden">
                  <span>{question}</span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-700 transition group-open:rotate-45">+</span>
                </summary>
                <p className="pt-4 text-sm leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
