"use client";

import { useEffect, useRef } from "react";
import type { KickgentPage } from "@/content/kickgent-pages";

const guardrailStyles = `
/* Design-system and accessibility guardrails: loaded after each page's approved styles. */
:where(a, button, summary, input, select, textarea):focus-visible {
  outline: 3px solid #e4bdff !important;
  outline-offset: 4px;
}
@media (pointer: coarse) {
  .menu, .menu-toggle, .nav-close, .header-cta, .pill-button, .btn, .tab, .tool-nav button, .faq-list summary {
    min-height: 44px;
  }
  .menu, .menu-toggle, .nav-close {
    min-width: 44px;
  }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
`;

type Props = { page: KickgentPage };

/**
 * The approved document structure is delivered through this Next client
 * component. App Router owns every route; runtime scripts are mounted only
 * after the page markup is present, preserving navigation, tab and FAQ UX.
 */
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
    return () => injected.forEach((script) => script.remove());
  }, [page.slug, page.scripts]);

  return (
    <>
      {page.styles ? <style dangerouslySetInnerHTML={{ __html: page.styles }} /> : null}
      <style dangerouslySetInnerHTML={{ __html: guardrailStyles }} />
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: page.markup }} />
    </>
  );
}
