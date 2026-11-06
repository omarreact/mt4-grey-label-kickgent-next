export type Page = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  highlights: string[];
  meta: string;
};

export const navigation = {
  solutions: [
    ["MT4 Grey Label", "mt4-grey-label"], ["MT5 Grey Label", "mt5-grey-label"],
    ["Forex Broker CRM", "forex-broker-crm"], ["PAMM & MAM Plugins", "pamm-mam"],
    ["Liquidity & Bridge", "forex-liquidity-bridge"], ["Broker Website", "forex-broker-website"],
  ],
  guides: [
    ["Start a Brokerage", "how-to-start-forex-brokerage"], ["Scale Your Brokerage", "scale-forex-brokerage"],
    ["Turnkey Brokerage", "turnkey-grey-label"],
  ],
} as const;

const rawPages: Page[] = [
  { slug: "mt4-grey-label", title: "MT4 Grey Label Solution for Forex Brokers", eyebrow: "PLATFORM LAUNCH", description: "Launch a branded MT4 brokerage with the connected platform, client operations and support structure your business needs.", highlights: ["Brand-ready trading environment", "CRM and onboarding connections", "A practical route from setup to launch"], meta: "MT4 grey label" },
  { slug: "mt5-grey-label", title: "MT5 Grey Label Solution for Forex Brokers", eyebrow: "MODERN PLATFORM", description: "Build a branded brokerage around MT5 with scalable client management, integrations and a clear operational foundation.", highlights: ["Multi-asset platform foundation", "Integration-ready client workflows", "Flexible growth path"], meta: "MT5 grey label" },
  { slug: "turnkey-grey-label", title: "Turnkey Grey Label Forex Brokerage", eyebrow: "ONE CONNECTED STACK", description: "Bring platform, CRM, liquidity, hosting and a client-facing website together in one practical brokerage launch plan.", highlights: ["Connected technology decisions", "Fewer handoffs between vendors", "Launch with a coherent operating model"], meta: "Turnkey brokerage" },
  { slug: "forex-broker-crm", title: "Forex Broker CRM for Client Operations", eyebrow: "CLIENT OPERATIONS", description: "Give teams one place to manage leads, onboarding, trading accounts and the day-to-day work of growing a brokerage.", highlights: ["Lead-to-client workflows", "Account and onboarding visibility", "Ready for platform connections"], meta: "Forex CRM" },
  { slug: "forex-broker-website", title: "Forex Broker Website Design and Development", eyebrow: "CONVERSION EXPERIENCE", description: "Create a clear, fast and credible broker website that connects your offering to lead capture and client onboarding.", highlights: ["Conversion-led page structure", "Clear product storytelling", "Built to connect with your stack"], meta: "Broker website" },
  { slug: "forex-liquidity-bridge", title: "Forex Liquidity and MT4 / MT5 Bridge", eyebrow: "CONNECTED EXECUTION", description: "Plan the infrastructure that joins your platforms, liquidity providers and broker workflows without unnecessary complexity.", highlights: ["Platform-to-liquidity routing", "Integration-aware decisions", "Operationally clear architecture"], meta: "Liquidity & bridge" },
  { slug: "pamm-mam", title: "PAMM and MAM Plugins for MT4 and MT5", eyebrow: "ACCOUNT MANAGEMENT", description: "Extend your brokerage offering with account-management tools designed to fit within a dependable operating stack.", highlights: ["PAMM and MAM capability", "Platform-aware integrations", "A managed rollout approach"], meta: "PAMM & MAM" },
  { slug: "how-to-start-forex-brokerage", title: "How to Start a Forex Brokerage", eyebrow: "LAUNCH GUIDE", description: "A practical framework for choosing a platform, client operations, liquidity, website and the right order of decisions.", highlights: ["Understand the launch sequence", "Choose the technology stack", "Avoid disconnected setup work"], meta: "Brokerage launch guide" },
  { slug: "scale-forex-brokerage", title: "Technology to Scale Your Forex Brokerage", eyebrow: "GROWTH GUIDE", description: "Upgrade the systems around your brokerage when stronger workflows, automation and connections become the next priority.", highlights: ["Improve client operations", "Strengthen integrations", "Build for sustainable scale"], meta: "Brokerage scale guide" },
  { slug: "about", title: "Technology That Fits the Brokerage You Are Building", eyebrow: "ABOUT GREYLABEL", description: "GreyLabel turns a complicated collection of brokerage technology choices into a more understandable, connected plan.", highlights: ["Technology without unnecessary jargon", "A focused launch and growth partner", "Built around real operating needs"], meta: "About GreyLabel" },
];

export const pages = Object.fromEntries(rawPages.map((page) => [page.slug, page]));
export const pageList = rawPages;
