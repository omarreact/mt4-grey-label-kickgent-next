export default {
  schemaVersion: "1.0",
  generator: "pintheme",
  project: {
    id: "kickgent-greylabel",
    name: "Kickgent GreyLabel",
    themeSlug: "kickgent-pintheme",
    themeVersion: "1.0.0",
  },
  source: {
    repository: "omarreact/mt4-grey-label-kickgent-next",
    branch: "main",
    pagesFile: "content/kickgent-pages.ts",
  },
  outputs: {
    htmlDirectory: "out",
    wordpressThemeDirectory: "wordpress/kickgent-pintheme",
    wordpressPluginDirectory: "wordpress/pintheme-manager",
    releaseDirectory: "dist",
  },
  routes: [
    "/",
    "/mt4-grey-label",
    "/mt5-grey-label",
    "/turnkey-grey-label",
    "/forex-broker-crm",
    "/forex-broker-website",
    "/forex-liquidity-bridge",
    "/pamm-mam",
    "/how-to-start-forex-brokerage",
    "/scale-forex-brokerage",
    "/about",
  ],
};
