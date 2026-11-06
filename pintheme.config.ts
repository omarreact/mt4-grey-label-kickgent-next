export type PinThemeEnvironmentStatus =
  | "NOT CONFIGURED"
  | "CONFIGURED"
  | "BUILDING"
  | "DEPLOYED"
  | "VERIFIED"
  | "FAILED";

const config = {
  schemaVersion: "1.0",
  generator: "pintheme",
  site: {
    name: "GreyLabel Technology",
    shortName: "GreyLabel",
    slug: "greylabel-technology",
  },
  author: { name: "PINCODE IT" },
  project: {
    id: "greylabel-technology",
    themeVersion: "1.0.0",
    managerVersion: "1.0.0",
  },
  framework: {
    frontend: "nextjs",
    language: "typescript",
    styling: "tailwindcss",
  },
  source: {
    repository: "omarreact/mt4-grey-label-kickgent-next",
    branch: "main",
    pagesFile: "content/kickgent-pages.ts",
  },
  urls: {
    nextjs: "https://mt4-grey-label-kickgent-next.vercel.app/",
    html: null as string | null,
    wordpress: null as string | null,
  },
  status: {
    nextjs: "CONFIGURED" as PinThemeEnvironmentStatus,
    html: "NOT CONFIGURED" as PinThemeEnvironmentStatus,
    wordpress: "NOT CONFIGURED" as PinThemeEnvironmentStatus,
  },
  deployments: {
    htmlBasePath: "/mt4-grey-label-kickgent-next",
  },
  outputs: {
    nextjs: true,
    html: true,
    wordpress: true,
  },
} as const;

export default config;
