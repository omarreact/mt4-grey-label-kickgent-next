"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "./BrandLogo";

const heroSlides = [
  {
    id: "launch",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=2200&q=88",
    label: "Brokerage launch",
    badge: "MT4 & MT5 brokerage technology",
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
    badge: "Connected broker operations",
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
    badge: "Scale without fragmentation",
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

  return (
    <main className="overflow-hidden bg-[#100414] text-white">
      <section
        data-hero-banner
        data-active-slide={activeHero.id}
        className="relative isolate h-fit overflow-hidden bg-[#f3e7fb] p-0 text-center"
      >
        <div
          data-hero-frame
          className="relative isolate h-fit w-full overflow-hidden bg-[#f3e7fb]"
        >
          <div className="pointer-events-none absolute inset-0 -z-30" aria-hidden="true">
            {heroSlides.map((slide, index) => (
              <img
                key={slide.id}
                data-hero-background={slide.id}
                src={slide.image}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === heroSlide ? "opacity-100" : "opacity-0"} ${slide.id === "launch" ? "object-[center_46%]" : "object-center"}`}
              />
            ))}
          </div>

          <div
            data-hero-overlay
            className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(115deg,rgba(247,237,253,.87),rgba(229,206,246,.79)_54%,rgba(204,230,235,.69))]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[82px_0_0] -z-10 bg-[repeating-linear-gradient(90deg,transparent_0_7.6%,rgba(112,65,165,.105)_7.65%_12.5%)] [mask-image:linear-gradient(90deg,transparent,#000_15%_85%,transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[155px] -z-10 h-[125vw] w-[125vw] max-h-[520px] max-w-[520px] -translate-x-1/2 rounded-full border border-violet-700/20 md:bottom-[-260px] md:left-[9%] md:right-[9%] md:top-[155px] md:h-auto md:w-auto md:max-h-none md:max-w-none md:translate-x-0 md:rounded-[50%] md:border-b-0"
          />

          <div
            data-hero-left
            data-hero-scene={activeHero.id}
            aria-live="polite"
            className="relative grid h-fit place-items-center px-5 pb-12 pt-10 text-center sm:px-7 md:px-10 md:pb-14 md:pt-12 xl:pb-12 xl:pt-10"
          >
            {heroSlides.map((slide, index) => {
              const isActive = heroSlide === index;

              return (
                <div
                  key={slide.id}
                  data-hero-copy={slide.id}
                  aria-hidden={!isActive}
                  className={`col-start-1 row-start-1 mx-auto flex w-full max-w-[1100px] flex-col items-center transition-all duration-500 ${
                    isActive
                      ? heroVisible
                        ? "visible translate-y-0 opacity-100"
                        : "visible translate-y-2 opacity-0"
                      : "invisible pointer-events-none translate-y-2 opacity-0"
                  }`}
                >
                  <span className="inline-flex items-center gap-[9px] rounded-full border border-violet-300/45 bg-white/45 py-2 pl-[11px] pr-4 text-[.78rem] font-medium text-[#513968] shadow-[inset_0_1px_#fff,0_8px_22px_rgba(87,48,107,.11)] backdrop-blur-sm">
                    <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center"><BrandLogo compact className="size-5" /></span>
                    <span>{slide.badge}</span>
                  </span>

                  <h1 className="mt-[34px] max-w-[1100px] text-balance text-[clamp(3.3rem,6.1vw,5.8rem)] font-[650] leading-[1.15] tracking-[-.045em] text-[#28113d] max-[640px]:mt-6 max-[640px]:text-[clamp(2.1rem,9vw,2.9rem)] max-[640px]:tracking-[-.04em]">
                    <span className="block">{slide.title}</span>
                    <span className="block bg-gradient-to-r from-[#512278] to-[#963fbe] bg-clip-text text-transparent">
                      {slide.titleAccent}
                    </span>
                  </h1>

                  <p className="mt-4 max-w-[570px] text-pretty text-base leading-[1.7] text-[#5b476c] max-[640px]:text-[.96rem] max-[640px]:leading-[1.65]">
                    {slide.description}
                  </p>

                  <div data-hero-actions className="mt-[30px] flex flex-wrap items-center justify-center gap-3 max-[480px]:mt-[22px] max-[480px]:w-full max-[480px]:flex-col max-[480px]:gap-[10px]">
                    <Link
                      href={slide.primary.href}
                      tabIndex={isActive ? undefined : -1}
                      className="inline-flex min-h-[52px] items-center justify-center gap-[10px] rounded-[11px] border border-[#d7aaff91] bg-gradient-to-br from-[#8038e9] to-[#a95be9] px-[22px] text-sm font-extrabold !text-white shadow-[inset_0_1px_#ffffff80,0_10px_24px_#742bb147] transition hover:-translate-y-[3px] hover:brightness-110 max-[480px]:min-h-12 max-[480px]:w-full"
                    >
                      {slide.primary.label} <ArrowIcon />
                    </Link>
                    <Link
                      href={slide.secondary.href}
                      tabIndex={isActive ? undefined : -1}
                      className="hero-secondary-cta inline-flex min-h-[52px] items-center justify-center gap-[10px] rounded-[11px] border border-[#6f2fac6b] bg-white/80 px-[22px] text-sm font-extrabold shadow-[0_8px_18px_#4b23631a] backdrop-blur-sm transition hover:-translate-y-[3px] hover:border-[#7c39b4] hover:bg-white max-[480px]:min-h-12 max-[480px]:w-full"
                    >
                      {slide.secondary.label} <ArrowIcon />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            data-hero-indicators
            className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-2"
            role="tablist"
            aria-label="Banner slides"
          >
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-label={`Show ${slide.label} banner`}
                aria-selected={heroSlide === index}
                onClick={() => selectHeroSlide(index)}
                className={`h-2.5 rounded-full border border-violet-700/30 transition-all ${heroSlide === index ? "w-8 bg-violet-700" : "w-2.5 bg-white/70 hover:bg-violet-300"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#18071f] px-4 py-14 sm:px-6 sm:py-16">
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

      <section id="solutions" className="h-fit bg-[#f7f3fb] px-4 py-14 text-slate-950 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="text-xs font-extrabold tracking-[.18em] text-violet-700">MORE THAN A PLATFORM</span>
            <h2 className="mt-4 text-balance text-[clamp(2.5rem,5.2vw,4.8rem)] font-semibold leading-[1.02] tracking-[-.055em]">
              More systems than most founders expect
            </h2>
            <p className="mx-auto mt-5 max-w-[680px] text-base leading-[1.6] text-slate-600">
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
                <p className="relative mt-3 max-w-[440px] text-sm leading-[1.55] text-slate-600">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-active-journey className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-16">
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
            <p className="mx-auto mt-5 max-w-[690px] text-base leading-[1.6] text-violet-100/65">
              Follow the client from first registration to an active trading relationship, while each system keeps the next team and next action in context.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
            <div
              data-journey-tabs
              className="grid grid-cols-4 gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-1"
              role="tablist"
              aria-label="Active client journey"
            >
              {journeySteps.map((step, index) => {
                const selected = index === journeyIndex;
                return (
                  <button
                    data-journey-tab={step.title}
                    key={step.title}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`journey-panel-${index}`}
                    onClick={() => setJourneyIndex(index)}
                    className={[
                      "tab flex aspect-square min-h-0 w-full items-center justify-center rounded-[18px] border p-3 text-center transition md:aspect-auto md:min-h-24 md:justify-start md:gap-4 md:p-5 md:text-left",
                      selected
                        ? "border-fuchsia-300/55 bg-white/14 shadow-[0_14px_38px_rgba(81,25,115,.3)] backdrop-blur-2xl"
                        : "border-white/10 bg-white/[.045] hover:border-white/20 hover:bg-white/[.075]",
                    ].join(" ")}
                  >
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl transition md:size-11 ${
                      selected ? "bg-fuchsia-200 text-violet-950" : "bg-white/8 text-violet-100/70"
                    }`}>
                      <FeatureIcon name={step.icon} className="size-5" />
                    </span>
                    <span className="sr-only">{step.title}: {step.label}</span>
                    <span className="hidden min-w-0 md:block">
                      <strong className="block break-words text-base font-bold">{step.title}</strong>
                      <span className="mt-1 block break-words text-xs leading-5 text-violet-100/55">{step.label}</span>
                    </span>
                    <span className="ml-auto hidden text-fuchsia-200 lg:block">↗</span>
                  </button>
                );
              })}
            </div>

            <article
              data-journey-stage
              className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[radial-gradient(circle_at_78%_18%,rgba(192,132,252,.3),transparent_34%),rgba(255,255,255,.055)] p-5 shadow-[0_28px_80px_rgba(8,2,14,.28)] backdrop-blur-2xl sm:p-8"
            >
              <div data-journey-panels className="grid">
                {journeySteps.map((step, index) => {
                  const selected = index === journeyIndex;
                  const progressClass = ["w-1/4", "w-1/2", "w-3/4", "w-full"][index];
                  const nextOwner = index < 2 ? "Client operations" : "Retention & support";
                  const automation =
                    index === 0
                      ? "Create client profile"
                      : index === 1
                        ? "Confirm funding state"
                        : index === 2
                          ? "Provision trading access"
                          : "Track engagement";

                  return (
                    <div
                      data-journey-panel={step.title}
                      id={`journey-panel-${index}`}
                      key={step.title}
                      role="tabpanel"
                      aria-hidden={!selected}
                      className={`col-start-1 row-start-1 min-w-0 transition-all duration-300 ${
                        selected
                          ? "visible translate-y-0 opacity-100"
                          : "invisible pointer-events-none translate-y-1 opacity-0"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                          <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[.16em] text-fuchsia-200">
                            <FeatureIcon name={step.icon} className="size-4" /> CONNECTED WORKFLOW
                          </span>
                          <h3 className="mt-3 break-words text-3xl font-semibold tracking-[-.05em] sm:text-4xl">{step.title}</h3>
                          <p className="mt-4 max-w-[620px] text-sm leading-[1.55] text-violet-100/70 sm:text-base">{step.text}</p>
                        </div>
                        <span className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200 backdrop-blur-xl">
                          Live workflow
                        </span>
                      </div>

                      <div className="mt-8 rounded-[22px] border border-white/15 bg-[#12051a]/45 p-4 backdrop-blur-2xl sm:p-5">
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div className={`h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-300 transition-all duration-500 ${progressClass}`} />
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          {[
                            ["CRM event", step.label],
                            ["Next owner", nextOwner],
                            ["Automation", automation],
                            ["Visibility", "Status shared across the connected stack"],
                          ].map(([label, value]) => (
                            <div key={label} className="min-w-0 rounded-xl border border-white/10 bg-white/[.055] p-4">
                              <span className="block text-[10px] font-black uppercase tracking-[.14em] text-violet-100/45">{label}</span>
                              <strong className="mt-2 block break-words text-sm leading-6 text-violet-50">{value}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="h-fit bg-[#f7f3fb] px-4 py-14 text-slate-950 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[780px]">
              <span className="text-xs font-extrabold tracking-[.18em] text-violet-700">EXPLORE EVERY SOLUTION</span>
              <h2 className="mt-4 text-balance text-[clamp(2.5rem,5vw,4.6rem)] font-semibold leading-[1.02] tracking-[-.055em]">
                The complete brokerage technology library
              </h2>
              <p className="mt-5 max-w-[690px] text-base leading-[1.6] text-slate-600">
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
            className="mt-8 flex items-stretch snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {solutionSlides.map((slide) => (
              <Link
                data-solution-card
                key={slide.title}
                href={slide.href}
                className="group relative flex min-w-0 shrink-0 basis-[86%] snap-start flex-col self-stretch overflow-hidden rounded-[26px] bg-white p-6 text-slate-950 shadow-[0_18px_45px_rgba(52,30,74,.08)] ring-1 ring-slate-200/80 no-underline transition hover:-translate-y-1 hover:ring-violet-300 sm:basis-[48%] lg:basis-[31.5%]"
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
                <p className="relative mt-4 flex-1 text-sm leading-[1.55] text-slate-600">{slide.text}</p>
                <span className="relative mt-auto inline-flex pt-7 text-sm font-extrabold text-violet-700">Explore solution →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f0314] px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-5 lg:grid-cols-2">
          <article className="rounded-[28px] border border-white/10 bg-white/[.045] p-6 sm:p-8">
            <span className="text-xs font-extrabold tracking-[.16em] text-fuchsia-200">PLATFORM CHOICE</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.055em]">MT4 or MT5?</h2>
            <p className="mt-4 max-w-[520px] text-sm leading-[1.55] text-violet-100/65">
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
            <p className="mt-4 text-sm leading-[1.55] text-violet-100/65">
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

      <section className="bg-[#f7f3fb] px-4 py-14 text-slate-950 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="text-xs font-extrabold tracking-[.18em] text-violet-700">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-.06em]">Clear answers before you build</h2>
            <p className="mt-5 max-w-[480px] text-base leading-[1.6] text-slate-600">
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
                <p className="pt-4 text-sm leading-[1.55] text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
