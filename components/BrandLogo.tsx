"use client";

import { useId } from "react";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BrandLogo({ className = "", compact = false }: BrandLogoProps) {
  const gradientId = useId().replaceAll(":", "");
  const glowId = `${gradientId}-glow`;

  return (
    <svg
      viewBox={compact ? "0 0 56 56" : "0 0 246 56"}
      role="img"
      aria-label="GreyLabel Technology"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="7" x2="48" y2="49" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C084FC" />
          <stop offset="0.48" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#5B21B6" />
        </linearGradient>
        <filter id={glowId} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0.55 0 0 0 0.25  0 0.35 0 0 0.05  0 0 0.85 0 0.6  0 0 0 0.45 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${glowId})`}>
        <path
          d="M28 4.5c13 0 23.5 10.5 23.5 23.5S41 51.5 28 51.5 4.5 41 4.5 28 15 4.5 28 4.5Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M28 12.5c7.1 0 13.1 4.7 15 11.2H34.2a7.7 7.7 0 1 0 .7 7.9h-8.1v-7.1h17.3c.2 1.1.4 2.3.4 3.5 0 9.1-7.4 16.5-16.5 16.5S11.5 37.1 11.5 28 18.9 12.5 28 12.5Z"
          fill="white"
          fillOpacity="0.96"
        />
        <circle cx="40.2" cy="15.8" r="3.8" fill="#F5D0FE" />
      </g>

      {!compact && (
        <>
          <text
            x="68"
            y="28"
            fill="currentColor"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="22"
            fontWeight="800"
            letterSpacing="-0.8"
          >
            GreyLabel
          </text>
          <text
            x="69"
            y="43"
            fill="currentColor"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="2.1"
            opacity="0.62"
          >
            TECHNOLOGY
          </text>
        </>
      )}
    </svg>
  );
}
