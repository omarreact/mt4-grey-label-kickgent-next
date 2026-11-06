"use client";

import { useEffect, useRef } from "react";
import type { KickgentPage } from "@/content/kickgent-pages";

type Props = { page: KickgentPage };

/**
 * The source documents are delivered through this Next client component.
 * Their approved markup stays intact while navigation, styles, metadata and
 * runtime behaviors are controlled by App Router routes.
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
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: page.markup }} />
    </>
  );
}
