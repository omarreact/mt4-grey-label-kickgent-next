"use client";

import { useEffect, useRef } from "react";
import type { KickgentPage } from "@/content/kickgent-pages";

const guardrailStyles = `
:where(a, button, summary, input, select, textarea):focus-visible { outline:3px solid #e4bdff !important; outline-offset:4px; }

.kg-page-content .site-header,.kg-page-content .nav,.kg-page-content .site-footer,.kg-page-content .footer,.kg-page-content .skip,.kg-page-content .skip-to-content{display:none !important}
@media (pointer:coarse){.tab,.tool-nav button,.faq-list summary{min-height:44px}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;scroll-behavior:auto !important;transition-duration:.01ms !important}}
`;

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
    return () => injected.forEach((script) => script.remove());
  }, [page.slug, page.scripts]);

  return <>
    {page.styles ? <style dangerouslySetInnerHTML={{ __html: page.styles }} /> : null}
    <style dangerouslySetInnerHTML={{ __html: guardrailStyles }} />
    <div id="kg-page-content" className="kg-page-content" ref={rootRef} dangerouslySetInnerHTML={{ __html: page.markup }} />
  </>;
}
