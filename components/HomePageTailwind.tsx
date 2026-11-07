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
    icon: "M4",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "MT5 Grey Label",
    text: "Add multi-asset capability, modern order types and a scalable platform for brokers building beyond forex-only workflows.",
    icon: "M5",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Forex Broker CRM",
    text: "Bring registration, KYC, payments, client accounts and partner management into one connected operational layer.",
    icon: "CRM",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "PAMM / MAM",
    text: "Support professional money managers with allocation, investor reporting and fee workflows connected to your brokerage stack.",
    icon: "PM",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Liquidity & Bridge",
    text: "Connect trading platforms to liquidity providers with routing, failover and execution workflows aligned to your model.",
    icon: "LB",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  },
];

const journeySteps = [
  {
    title: "Registration",
    label: "Lead → verified client",
    text: "Capture the lead, create the client record and collect the identity information your onboarding workflow needs.",
    metric: "01",
  },
  {
    title: "KYC & funding",
    label: "Verified → funded",
    text: "Move approved clients into deposits and payment confirmation without forcing your operations team to re-enter data.",
    metric: "02",
  },
  {
    title: "Trading account",
    label: "Funded → trading",
    text: "Create MT4 or MT5 accounts through the manager API, assign groups and deliver credentials from the connected CRM.",
    metric: "03",
  },
  {
    title: "Retention",
    label: "Trading → growing",
    text: "Keep account activity, partner attribution, reporting and support context visible as the client relationship expands.",
    metric: "04",
  },
];

const solutionSlides = [
  ["MT4 Grey Label", "A branded MT4 environment with manager access, group configuration and broker integrations.", "/mt4-grey-label", "01"],
  ["MT5 Grey Label", "A modern multi-asset platform setup with CRM, liquidity and operational connectivity.", "/mt5-grey-label", "02"],
  ["Forex Broker CRM", "Client onboarding, KYC, payments, trading accounts and IB management in one back office.", "/forex-broker-crm", "03"],
  ["PAMM & MAM Plugins", "Managed-account tooling for allocation, fees, investors and reporting.", "/pamm-mam", "04"],
  ["Liquidity & Bridge", "Execution connectivity designed around platform, provider and routing requirements.", "/forex-liquidity-bridge", "05"],
  ["Broker Website", "A conversion-focused client-facing website connected to registration and platform journeys.", "/forex-broker-website", "06"],
  ["Start a Brokerage", "A practical launch guide covering the platform, CRM, liquidity, website and infrastructure stack.", "/how-to-start-forex-brokerage", "07"],
  ["Scale Your Brokerage", "Automation, capacity, products and integrations for an operation that is already growing.", "/scale-forex-brokerage", "08"],
  ["Turnkey Brokerage", "Platform, CRM, liquidity, website and hosting delivered as one coordinated launch stack.", "/turnkey-grey-label", "09"],
  ["About GreyLabel", "Our approach to implementation, integration, infrastructure and long-term technical support.", "/about", "10"],
] as const;

const processSteps = [
  {
    no: "01",
    title: "Discovery",
    text: "We map your target clients, jurisdictions, platform preference, budget and operating model before choosing technology.",
    detail: "Business goals · platform availability · compliance dependencies",
  },
  {
    no: "02",
    title: "Architecture",
    text: "We define how the platform, CRM, payments, liquidity, managed-account tools and website exchange data.",
    detail: "System map · API scope · ownership boundaries",
  },
  {
    no: "03",
    title: "Configuration",
    text: "Branding, groups, permissions, client flows and operational rules are configured in a controlled implementation sequence.",
    detail: "Brand assets · trading groups · client workflows",
  },
  {
    no: "04",
    title: "Integration & QA",
    text: "Every connection is tested across account creation, funding, trading access, reporting and exception paths.",
    detail: "Staging checks · mobile QA · workflow validation",
  },
  {
    no: "05",
    title: "Launch & support",
    text: "The brokerage moves live with monitoring, change control and an escalation path for post-launch adjustments.",
    detail: "Go-live checklist · support · growth roadmap",
  },
];

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

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fuchsia-300" fill="none">
      <path d="m4 10 3.5 3.5L16 5.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
        className="relative isolate overflow-hidden px-4 pb-10 pt-[112px] text-white sm:px-6 sm:pt-[122px] xl:h-[min(100svh,820px)] xl:min-h-[690px] xl:py-[104px]"
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
        <div className="pointer-events-none absolute inset-x-[5%] top-[15%] -z-10 hidden h-[68%] rounded-[50%] border border-white/20 xl:block" />

        <div className="mx-auto grid w-full max-w-[1180px] gap-7 xl:h-full xl:grid-cols-[0.94fr_1.06fr] xl:items-center xl:gap-12">
          <div
            data-hero-left
            data-hero-scene={activeHero.id}
            aria-live="polite"
            className={`min-w-0 rounded-[30px] border border-white/20 bg-slate-950/28 p-5 text-left shadow-[0_24px_70px_rgba(15,23,42,.22)] backdrop-blur-xl transition-all duration-500 sm:p-7 xl:p-8 ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          >
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/35 bg-white/14 px-3.5 py-2 text-[.68rem] font-bold tracking-[.1em] text-white shadow-[0_10px_30px_rgba(15,23,42,.18)] backdrop-blur-2xl sm:text-xs">
              <span className="grid size-5 shrink-0 place-items-center rounded-full border border-white/40 bg-white/20">✦</span>
              <span className="min-w-0 break-words">{activeHero.badge}</span>
            </span>

            <h1 className="mt-6 max-w-[620px] text-balance text-[clamp(2.45rem,5vw,4.65rem)] font-semibold leading-[.96] tracking-[-.06em] text-white drop-shadow-[0_4px_22px_rgba(15,23,42,.48)]">
              {activeHero.title}
              <span className="block">{activeHero.titleAccent}</span>
            </h1>

            <p className="mt-5 max-w-[590px] text-pretty text-[.95rem] font-medium leading-7 text-white/88 drop-shadow-[0_3px_18px_rgba(15,23,42,.45)] sm:text-[1.03rem]">
              {activeHero.description}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
            className={`relative min-w-0 rounded-[32px] border border-white/20 bg-white/10 p-4 shadow-[0_28px_80px_rgba(15,23,42,.24)] backdrop-blur-2xl transition-all duration-500 sm:p-5 xl:h-[470px] xl:p-6 ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          >
            <div className="pointer-events-none absolute inset-4 rounded-[28px] border border-white/15" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/20" />
            <div className="pointer-events-none absolute right-7 top-7 grid size-14 place-items-center rounded-full border border-white/25 bg-white/10 text-xl backdrop-blur-xl">
              ✦
            </div>

            <div className="relative z-10 grid h-full min-h-[440px] grid-rows-[auto_auto] gap-4 xl:min-h-0 xl:grid-rows-[1fr_auto]">
              <div
                data-hero-float
                className="mx-auto flex w-full max-w-[390px] min-w-0 flex-col justify-between rounded-[26px] border border-white/28 bg-slate-950/24 p-5 text-left shadow-[0_24px_65px_rgba(15,23,42,.22)] backdrop-blur-2xl sm:p-6"
              >
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/14">☰</span>
                  <span className="min-w-0 flex-1 break-words text-center text-xs font-bold tracking-[.08em] text-white/85">{activeHero.label}</span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/14">✎</span>
                </div>
                <div className="py-5 text-center">
                  <strong className="block break-words text-[1.8rem] font-medium leading-tight tracking-[-.05em] sm:text-[2rem]">
                    {activeHero.assistantTitle}
                  </strong>
                  <p className="mt-2 break-words text-sm leading-6 text-white/78">
                    {activeHero.assistantText}
                  </p>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                  {activeHero.assistantChips.map((chip) => (
                    <span key={chip} className="min-w-0 break-words rounded-xl border border-white/18 bg-white/10 p-3 text-xs text-white/90 backdrop-blur-xl">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  data-hero-float
                  className="min-w-0 rounded-[20px] border border-white/28 bg-slate-950/24 p-4 text-left shadow-[0_18px_48px_rgba(15,23,42,.2)] backdrop-blur-2xl"
                >
                  <span className="block break-words text-[11px] font-bold uppercase tracking-[.12em] text-white/75">{activeHero.progressLabel}</span>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r from-fuchsia-300 to-violet-300 transition-[width] duration-700 ${activeHero.progressClass}`}
                    />
                  </div>
                  <div className="mt-3 flex min-w-0 items-center justify-between gap-3 text-xs">
                    <span className="min-w-0 break-words text-white/75">{activeHero.progressText}</span>
                    <strong className="shrink-0 text-white">{activeHero.progressValue}%</strong>
                  </div>
                </div>

                <div
                  data-hero-float
                  className="min-w-0 rounded-[20px] border border-white/28 bg-slate-950/24 p-4 text-left shadow-[0_18px_48px_rgba(15,23,42,.2)] backdrop-blur-2xl"
                >
                  <span className="block break-words text-[11px] font-bold uppercase tracking-[.12em] text-white/75">{activeHero.systemsLabel}</span>
                  <div className="mt-3 grid gap-1.5">
                    {activeHero.systems.map((item) => (
                      <div key={item} className="flex min-w-0 items-center gap-2 text-xs text-white/90">
                        <span className="shrink-0">↗</span>
                        <span className="min-w-0 break-words">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
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

      <section id="solutions" className="bg-[#f7f3fb] px-4 py-20 text-slate-950 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="text-xs font-extrabold tracking-[.18em] text-violet-700">MORE THAN A PLATFORM</span>
            <h2 className="mt-4 text-balance text-[clamp(2.7rem,5.4vw,5rem)] font-semibold leading-[1] tracking-[-.06em]">
              More systems than most founders expect
            </h2>
            <p className="mx-auto mt-5 max-w-[680px] text-base leading-8 text-slate-600">
              The trading platform is only one layer. A working brokerage needs client operations, managed accounts, execution connectivity and a client-facing experience around it.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {platformCards.map((card) => (
              <article key={card.title} className="group relative min-h-[360px] overflow-hidden rounded-[24px] border border-slate-200 bg-violet-950 text-white shadow-[0_20px_50px_rgba(44,28,64,.12)]">
                <img
                  src={card.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100414] via-[#100414]/35 to-transparent" />
                <div className="absolute inset-x-3 bottom-3 rounded-[19px] border border-white/20 bg-[#180a22]/55 p-4 shadow-[0_18px_44px_rgba(5,2,10,.24)] backdrop-blur-2xl">
                  <span className="grid size-10 place-items-center rounded-xl border border-white/15 bg-white/10 text-xs font-black text-fuchsia-100">
                    {card.icon}
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-[-.03em]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-violet-100/72">{card.text}</p>
                </div>
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
          className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
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
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl text-xs font-black ${selected ? "bg-fuchsia-200 text-violet-950" : "bg-white/8 text-violet-100/70"}`}>
                      {step.metric}
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
                  <span className="text-xs font-extrabold tracking-[.16em] text-fuchsia-200">CONNECTED STEP {activeJourney.metric}</span>
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

      <section className="bg-[#f7f3fb] px-4 py-20 text-slate-950 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[780px]">
              <span className="text-xs font-extrabold tracking-[.18em] text-violet-700">EXPLORE EVERY SOLUTION</span>
              <h2 className="mt-4 text-balance text-[clamp(2.6rem,5vw,4.8rem)] font-semibold leading-[1] tracking-[-.06em]">
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
                className="grid size-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-700"
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
            {solutionSlides.map(([title, text, href, number]) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[320px] min-w-0 shrink-0 basis-[86%] snap-start flex-col rounded-[26px] border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_18px_45px_rgba(52,30,74,.08)] no-underline transition hover:-translate-y-1 hover:border-violet-300 sm:basis-[48%] lg:basis-[31.5%]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-violet-100 text-sm font-black text-violet-800">{number}</span>
                  <span className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-violet-200 group-hover:bg-violet-50 group-hover:text-violet-700">
                    <ArrowIcon />
                  </span>
                </div>
                <h3 className="mt-12 text-2xl font-semibold tracking-[-.04em]">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
                <span className="mt-auto pt-8 text-sm font-extrabold text-violet-700">Explore solution →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" data-how-it-works className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2200&q=86"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-slate-950/52 backdrop-blur-[1.5px]" />
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[780px] text-center">
            <span className="text-xs font-extrabold tracking-[.18em] text-fuchsia-200">HOW IT WORKS</span>
            <h2 className="mt-4 text-balance text-[clamp(2.6rem,5vw,4.8rem)] font-semibold leading-[1] tracking-[-.06em]">
              A detailed path from first call to an operating brokerage
            </h2>
            <p className="mx-auto mt-5 max-w-[700px] text-base leading-8 text-violet-100/65">
              Each stage has an owner, an output and a verification point, so the project moves forward without leaving critical integrations until the end.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-[8%] right-[8%] top-8 hidden h-px bg-gradient-to-r from-transparent via-fuchsia-300/40 to-transparent lg:block" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {processSteps.map((step, index) => (
                <article key={step.no} className="relative rounded-[22px] border border-white/10 bg-white/[.055] p-5 backdrop-blur-xl">
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl border border-fuchsia-200/20 bg-fuchsia-300/10 text-sm font-black text-fuchsia-100 backdrop-blur-xl">
                      {step.no}
                    </span>
                    {index < processSteps.length - 1 && <span className="text-violet-100/30 lg:hidden">→</span>}
                  </div>
                  <h3 className="mt-8 text-xl font-bold tracking-[-.035em]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-violet-100/65">{step.text}</p>
                  <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-3 text-xs leading-5 text-fuchsia-100/72 backdrop-blur-xl">
                    {step.detail}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_85%_20%,rgba(192,132,252,.2),transparent_34%),rgba(255,255,255,.04)] p-5 backdrop-blur-2xl sm:grid-cols-3 sm:p-7">
            {[
              ["Clear ownership", "Every stage has a responsible team and a defined hand-off."],
              ["Parallel verification", "Platform, CRM and client journeys are checked together before launch."],
              ["Change-ready design", "The stack can add markets, payments, managed accounts and capacity later."],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-3">
                <CheckIcon />
                <div>
                  <strong className="block text-sm">{title}</strong>
                  <p className="mt-1 text-xs leading-5 text-violet-100/55">{text}</p>
                </div>
              </div>
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

      <section className="bg-[#100414] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 overflow-hidden rounded-[32px] border border-white/15 bg-[radial-gradient(circle_at_82%_20%,rgba(217,70,239,.26),transparent_32%),linear-gradient(135deg,rgba(124,58,237,.24),rgba(255,255,255,.045))] p-7 shadow-[0_30px_85px_rgba(8,2,14,.28)] backdrop-blur-2xl sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[720px]">
            <span className="text-xs font-extrabold tracking-[.18em] text-fuchsia-200">START WITH THE RIGHT FOUNDATION</span>
            <h2 className="mt-4 text-balance text-[clamp(2.5rem,5vw,4.6rem)] font-semibold leading-[1] tracking-[-.06em]">
              Build a brokerage stack that can grow without becoming fragmented.
            </h2>
            <p className="mt-5 max-w-[650px] text-sm leading-7 text-violet-100/65 sm:text-base">
              Tell us what you want to launch, which systems you already have and where your operational bottlenecks are.
            </p>
          </div>
          <a
            data-bottom-cta-button
            href="mailto:admin@pincodeit.com?subject=GreyLabel%20Technology%20Consultation"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d7c4ea] bg-[#f0e7fb] px-5 text-sm font-extrabold !text-[#4a1f5f] shadow-xl transition hover:-translate-y-0.5 hover:bg-white"
          >
            Talk to our team <ArrowIcon />
          </a>
        </div>
      </section>
    </main>
  );
}
