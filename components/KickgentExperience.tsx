"use client";

import { useEffect, useRef } from "react";
import type { KickgentPage } from "@/content/kickgent-pages";

const guardrailStyles = `
:where(a, button, summary, input, select, textarea):focus-visible { outline:3px solid #e4bdff !important; outline-offset:4px; }

.kg-page-content .site-header,.kg-page-content .nav,.kg-page-content .site-footer,.kg-page-content .footer,.kg-page-content .skip,.kg-page-content .skip-to-content{display:none !important}
@media (pointer: coarse){.tab,.tool-nav button,.faq-list summary{min-height:44px}}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;scroll-behavior:auto !important;transition-duration:.01ms !important}}
`;

const glassOverlayClasses = [
  "!border-white/20",
  "!bg-white/10",
  "!shadow-[0_20px_60px_rgba(10,3,20,.22)]",
  "!backdrop-blur-2xl",
  "supports-[backdrop-filter]:!bg-white/8",
] as const;

const innerPageBackgrounds: Record<string, string> = {
  about: "https://images.unsplash.com/photo-1781246212288-7fa538344718?auto=format&fit=crop&w=2200&q=84",
  contact: "https://images.unsplash.com/photo-1702047129200-89734f555f38?auto=format&fit=crop&w=2200&q=84",
  "mt4-grey-label": "https://images.unsplash.com/photo-1768055105681-7d2096c5165f?auto=format&fit=crop&w=2200&q=84",
  "mt5-grey-label": "https://images.unsplash.com/photo-1766218331975-ecc29597ce9f?auto=format&fit=crop&w=2200&q=84",
  "turnkey-grey-label": "https://images.unsplash.com/photo-1774600134168-b9ebd714e4e1?auto=format&fit=crop&w=2200&q=84",
  "forex-broker-crm": "https://images.unsplash.com/photo-1771922748624-b205cf5d002d?auto=format&fit=crop&w=2200&q=84",
  "forex-broker-website": "https://images.unsplash.com/photo-1742199009963-c028d0c5a603?auto=format&fit=crop&w=2200&q=84",
  "forex-liquidity-bridge": "https://images.unsplash.com/photo-1768224656445-33d078c250b7?auto=format&fit=crop&w=2200&q=84",
  "pamm-mam": "https://images.unsplash.com/photo-1758518729711-1cbacd55efdb?auto=format&fit=crop&w=2200&q=84",
  "how-to-start-forex-brokerage": "https://images.unsplash.com/photo-1758873269811-4e62e346b4b7?auto=format&fit=crop&w=2200&q=84",
  "scale-forex-brokerage": "https://images.unsplash.com/photo-1758691737138-7b9b1884b1db?auto=format&fit=crop&w=2200&q=84",
};

type Props = { page: KickgentPage };

export function KickgentExperience({ page }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const injected: HTMLScriptElement[] = [];
    page.scripts.forEach((source, index) => {
      const script = document.createElement("script");
      script.dataset.kickgentRuntime = String(index);
      script.text = source;
      root.appendChild(script);
      injected.push(script);
    });

    const overlayTargets = root.querySelectorAll<HTMLElement>(
      ".art-bubble,.float,.runtime,.hero-ui .progress,.hero-ui .files,.related-card"
    );
    overlayTargets.forEach((element) => element.classList.add(...glassOverlayClasses));

    const pageHero = root.querySelector<HTMLElement>(".page-hero");
    const background = innerPageBackgrounds[page.slug];
    const injectedNodes: HTMLElement[] = [];

    if (pageHero && background) {
      pageHero.classList.add("!relative", "!isolate", "!overflow-hidden", "!bg-transparent", "!bg-none", "!text-white");

      const image = document.createElement("img");
      image.src = background;
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
      image.dataset.pinthemeInnerHero = page.slug;
      image.className = "pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover object-center";
      pageHero.prepend(image);
      injectedNodes.push(image);

      const scrim = document.createElement("div");
      scrim.setAttribute("aria-hidden", "true");
      scrim.className = "pointer-events-none absolute inset-0 -z-20 bg-slate-950/48 backdrop-blur-[1.5px]";
      pageHero.prepend(scrim);
      injectedNodes.push(scrim);

      pageHero.classList.add(
        "!min-h-0",
        "!pt-[122px]",
        "!pb-10",
        "sm:!pt-[136px]",
        "sm:!pb-12"
      );

      const heroGrid = pageHero.querySelector<HTMLElement>(".hero-grid");
      heroGrid?.classList.add("!grid-cols-1", "!gap-0", "!max-w-[980px]");

      const heroCopy = pageHero.querySelector<HTMLElement>(".hero-copy");
      heroCopy?.classList.add("!flex", "!max-w-[900px]", "!flex-col", "!items-start");

      const overline = pageHero.querySelector<HTMLElement>(".overline");
      const heroActions = pageHero.querySelector<HTMLElement>(".hero-actions");
      const heroArt = pageHero.querySelector<HTMLElement>(".hero-art");
      overline?.classList.add("!hidden");
      heroActions?.classList.add("!hidden");
      heroArt?.classList.add("!hidden");

      const title = pageHero.querySelector<HTMLElement>("h1");
      title?.classList.add(
        "!order-2",
        "!m-0",
        "!max-w-[900px]",
        "!text-white",
        "!text-[clamp(2.2rem,5vw,4.4rem)]",
        "!leading-[1.02]",
        "max-[640px]:!text-[clamp(1.8rem,8vw,2.35rem)]",
        "max-[640px]:!leading-[1.08]",
        "drop-shadow-[0_3px_18px_rgba(15,23,42,.5)]"
      );

      const subtitle = pageHero.querySelector<HTMLElement>(".lead-paragraph");
      subtitle?.classList.add(
        "!order-3",
        "!mt-4",
        "!mb-0",
        "!max-w-[760px]",
        "!text-base",
        "!leading-7",
        "!text-white/86",
        "sm:!text-lg",
        "max-[640px]:!text-[.94rem]",
        "max-[640px]:!leading-6",
        "drop-shadow-[0_3px_18px_rgba(15,23,42,.45)]"
      );

      const breadcrumbs = pageHero.querySelector<HTMLElement>(".breadcrumbs");
      if (breadcrumbs) {
        breadcrumbs.classList.add(
          "!order-1",
          "!mb-5",
          "!mt-0",
          "!inline-flex",
          "!w-fit",
          "!items-center",
          "!gap-2",
          "!rounded-full",
          "!border",
          "!border-white/25",
          "!bg-white/12",
          "!px-3.5",
          "!py-2",
          "!text-[.7rem]",
          "!font-extrabold",
          "!uppercase",
          "!tracking-[.1em]",
          "!text-white",
          "!shadow-[0_12px_34px_rgba(15,23,42,.18)]",
          "!backdrop-blur-xl"
        );
        breadcrumbs.querySelector<HTMLElement>("a")?.classList.add("!text-white/78", "hover:!text-white");
        const parts = breadcrumbs.querySelectorAll<HTMLElement>("span");
        if (parts[0]) {
          parts[0].textContent = "→";
          parts[0].classList.add("!text-white/45");
        }
        if (parts[1]) {
          parts[1].classList.add("!rounded-full", "!bg-white/14", "!px-2.5", "!py-1", "!text-white");
        }
      }
    }

    const pageSidebar = root.querySelector<HTMLElement>(".page-sidebar");
    pageSidebar?.classList.add("max-[880px]:!hidden");

    root.querySelectorAll<HTMLElement>(".chapter-tag")
      .forEach((element) => element.classList.add("!hidden"));

    const sidebarHelp = root.querySelector<HTMLElement>(".sidebar-help");
    if (sidebarHelp) {
      sidebarHelp.classList.add(
        "!bg-[#321543]",
        "!text-white",
        "!shadow-[0_16px_42px_rgba(50,21,67,.22)]",
        "!backdrop-blur-xl"
      );
      sidebarHelp.querySelector<HTMLElement>("p")?.classList.add("!text-violet-100/80");
      sidebarHelp.querySelector<HTMLElement>("a")?.classList.add("!text-white", "!font-extrabold");
      sidebarHelp.querySelector<HTMLElement>("b")?.classList.add("!text-white");
    }

    root.querySelectorAll<HTMLElement>(".bottom-cta")
      .forEach((element) => element.classList.add("!hidden"));

    return () => {
      injected.forEach((script) => script.remove());
      injectedNodes.forEach((node) => node.remove());
    };
  }, [page.slug, page.scripts]);

  return (
    <>
      {page.styles ? <style dangerouslySetInnerHTML={{ __html: page.styles }} /> : null}
      <style dangerouslySetInnerHTML={{ __html: guardrailStyles }} />
      <div
        id="kg-page-content"
        className="kg-page-content"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: page.markup }}
      />
    </>
  );
}
