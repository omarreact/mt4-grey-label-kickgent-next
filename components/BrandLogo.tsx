"use client";

import { useId } from "react";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
  tone?: "dark" | "light";
};

export function BrandLogo({ className = "", compact = false, tone = "dark" }: BrandLogoProps) {
  const id = useId().replaceAll(":", "");
  const primary = `${id}-primary`;
  const accent = `${id}-accent`;
  const glow = `${id}-glow`;
  const textColor = tone === "light" ? "#FFFFFF" : "#241036";
  const subColor = tone === "light" ? "#CDB7D8" : "#7B6387";

  return (
    <svg
      viewBox={compact ? "0 0 56 56" : "0 0 258 56"}
      role="img"
      aria-label="MT4 Grey Label"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={primary} x1="7" y1="46" x2="48" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6D28D9" />
          <stop offset="0.5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#D8B4FE" />
        </linearGradient>
        <linearGradient id={accent} x1="7" y1="41" x2="49" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0ABFC" />
          <stop offset="0.52" stopColor="#C084FC" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <filter id={glow} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="2.1" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0.49 0 0 0 0.28  0 0.28 0 0 0.08  0 0 0.8 0 0.65  0 0 0 .35 0" />
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <g filter={`url(#${glow})`}>
        <rect x="4" y="4" width="48" height="48" rx="15" fill={tone === "light" ? "#1A0A24" : "#F6F0FB"} fillOpacity={tone === "light" ? ".9" : ".96"} />
        <path d="M13 36.5 21 27l6.2 5.8L36 20l7 4.5" stroke={`url(#${accent})`} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.2 31.7V23h5.2v8.7M26 28V18.2h5.2V28M35.8 23.5V12.8H41v10.7" fill={`url(#${primary})`}/>
        <path d="M11 40c8.8 3.1 18.2 2.1 27.8-3.1 3.7-2 6.8-4.3 9.2-7" stroke={`url(#${accent})`} strokeWidth="3.5" strokeLinecap="round"/>
      </g>

      {!compact && (
        <>
          <text x="67" y="30" fill={textColor} fontFamily="Inter, Arial, sans-serif" fontSize="21.5" fontWeight="850" letterSpacing="-0.75">
            MT4 Grey Label
          </text>
          <text x="68" y="43.5" fill={subColor} fontFamily="Inter, Arial, sans-serif" fontSize="7.8" fontWeight="750" letterSpacing="1.65">
            BROKERAGE TECHNOLOGY
          </text>
        </>
      )}
    </svg>
  );
}
