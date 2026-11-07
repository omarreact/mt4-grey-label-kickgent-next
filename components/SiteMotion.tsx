"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const baseMotion = [
  "opacity-0",
  "translate-y-6",
  "transition-all",
  "duration-700",
  "ease-out",
  "motion-reduce:opacity-100",
  "motion-reduce:translate-y-0",
  "motion-reduce:transition-none",
];

const visibleMotion = ["opacity-100", "translate-y-0"];

export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const routeShell = document.querySelector<HTMLElement>("#main-content");

    if (routeShell) {
      routeShell.classList.remove("route-entered");
      routeShell.classList.add("route-entering");
      if (reduceMotion) {
        routeShell.classList.remove("route-entering");
        routeShell.classList.add("route-entered");
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          routeShell.classList.remove("route-entering");
          routeShell.classList.add("route-entered");
        }));
      }
    }
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#main-content section, #main-content .content-section, #main-content .related-card, #main-content .page-sidebar, [data-global-how-it-works], [data-global-cta], footer > div"
      )
    );

    if (reduceMotion) {
      targets.forEach((element) => element.classList.add(...visibleMotion));
      return;
    }

    targets.forEach((element, index) => {
      element.classList.add(...baseMotion);
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.remove("opacity-0", "translate-y-6");
          element.classList.add(...visibleMotion);
          observer.unobserve(element);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      routeShell?.classList.remove("route-entering", "route-entered");
      targets.forEach((element) => {
        element.style.transitionDelay = "";
      });
    };
  }, [pathname]);

  return null;
}
