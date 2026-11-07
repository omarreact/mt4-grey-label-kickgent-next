/* PinTheme single-HTML runtime: operates on the pre-rendered Next.js HTML. */
(() => {
  "use strict";
  const config = JSON.parse(document.getElementById("single-html-config").textContent);
  const root = document.getElementById("main-content");
  const templates = new Map(Array.from(document.querySelectorAll("template[data-site-route]"),
    (template) => [template.dataset.siteRoute, template]));
  const valid = new Set(config.routes);
  const menu = document.querySelector(".kg-global-menu");
  const nav = document.getElementById("kg-primary-navigation");
  const topButton = document.querySelector("[data-scroll-top]");
  let current = "";
  let heroTimer;

  function view() {
    const hash = decodeURI(location.hash.slice(1) || "/");
    const [raw, search] = hash.split("?");
    const route = (raw || "/").replace(/\/+$/, "") || "/";
    return {
      route: valid.has(route) ? route : "/",
      section: new URLSearchParams(search || "").get("section")
    };
  }
  function classes(element, remove, add) {
    if (!element) return;
    for (const name of remove || []) element.classList.remove(name);
    for (const name of add || []) element.classList.add(name);
  }
  function setGroup(button, expanded) {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;
    button.setAttribute("aria-expanded", String(expanded));
    classes(panel,
      expanded ? ["invisible", "opacity-0", "pointer-events-none", "max-[880px]:hidden"] : ["visible", "opacity-100", "pointer-events-auto"],
      expanded ? ["visible", "opacity-100", "pointer-events-auto"] : ["invisible", "opacity-0", "pointer-events-none", "max-[880px]:hidden"]);
  }
  function closeMenu() {
    if (menu && nav) {
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
      classes(nav, ["max-[880px]:flex"], ["max-[880px]:hidden"]);
    }
    document.querySelectorAll('button[aria-controls="kg-solutions-menu"],button[aria-controls="kg-guides-menu"]')
      .forEach((button) => setGroup(button, false));
  }
  function initChrome() {
    if (menu && nav) {
      menu.addEventListener("click", () => {
        const opening = menu.getAttribute("aria-expanded") !== "true";
        menu.setAttribute("aria-expanded", String(opening));
        menu.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
        classes(nav, opening ? ["max-[880px]:hidden"] : ["max-[880px]:flex"],
          opening ? ["max-[880px]:flex"] : ["max-[880px]:hidden"]);
      });
    }
    document.querySelectorAll('button[aria-controls="kg-solutions-menu"],button[aria-controls="kg-guides-menu"]').forEach((button) => {
      button.addEventListener("click", () => setGroup(button, button.getAttribute("aria-expanded") !== "true"));
      button.parentElement?.addEventListener("mouseenter", () => {
        if (innerWidth > 880) setGroup(button, true);
      });
      button.parentElement?.addEventListener("mouseleave", () => {
        if (innerWidth > 880) setGroup(button, false);
      });
    });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
    nav?.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });
    topButton?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
    function updateTop() {
      classes(topButton,
        scrollY > 520 ? ["invisible", "translate-y-3", "opacity-0"] : ["visible", "translate-y-0", "opacity-100"],
        scrollY > 520 ? ["visible", "translate-y-0", "opacity-100"] : ["invisible", "translate-y-3", "opacity-0"]);
    }
    addEventListener("scroll", updateTop, { passive: true });
    updateTop();
  }
  function slide(index) {
    const hero = root.querySelector("[data-hero-banner]");
    if (!hero) return;
    const copies = Array.from(root.querySelectorAll("[data-hero-copy]"));
    if (!copies[index]) return;
    hero.dataset.activeSlide = copies[index].dataset.heroCopy;
    const scene = root.querySelector("[data-hero-scene]");
    if (scene) scene.dataset.heroScene = hero.dataset.activeSlide;
    copies.forEach((node, i) => {
      const yes = i === index;
      node.setAttribute("aria-hidden", String(!yes));
      classes(node,
        yes ? ["invisible", "pointer-events-none", "translate-y-2", "opacity-0"] : ["visible", "translate-y-0", "opacity-100"],
        yes ? ["visible", "translate-y-0", "opacity-100"] : ["invisible", "pointer-events-none", "translate-y-2", "opacity-0"]);
      node.querySelectorAll("a").forEach((a) => a.tabIndex = yes ? 0 : -1);
    });
    root.querySelectorAll("[data-hero-banner] .absolute.inset-0.-z-30 > img").forEach((node, i) =>
      classes(node, [i === index ? "opacity-0" : "opacity-100"], [i === index ? "opacity-100" : "opacity-0"]));
    root.querySelectorAll("[data-hero-indicators] button").forEach((node, i) => {
      const yes = i === index;
      node.setAttribute("aria-selected", String(yes));
      classes(node, yes ? ["w-2.5", "bg-white/35"] : ["w-8", "bg-white"],
        yes ? ["w-8", "bg-white"] : ["w-2.5", "bg-white/35"]);
    });
  }
  function initHome() {
    let activeSlide = 0;
    const buttons = Array.from(root.querySelectorAll("[data-hero-indicators] button"));
    buttons.forEach((button, i) => button.addEventListener("click", () => {
      activeSlide = i;
      slide(activeSlide);
    }));
    if (buttons.length > 1) heroTimer = setInterval(() => {
      activeSlide = (activeSlide + 1) % buttons.length;
      slide(activeSlide);
    }, 6500);

    const tabs = Array.from(root.querySelectorAll("[data-journey-tab]"));
    const panels = Array.from(root.querySelectorAll("[data-journey-panel]"));
    tabs.forEach((button, i) => button.addEventListener("click", () => {
      tabs.forEach((tab, j) => {
        const yes = i === j;
        tab.setAttribute("aria-selected", String(yes));
        classes(tab,
          yes ? ["border-white/10", "bg-white/[.045]"] : ["border-fuchsia-300/55", "bg-white/14"],
          yes ? ["border-fuchsia-300/55", "bg-white/14"] : ["border-white/10", "bg-white/[.045]"]);
      });
      panels.forEach((panel, j) => {
        const yes = i === j;
        panel.setAttribute("aria-hidden", String(!yes));
        classes(panel,
          yes ? ["invisible", "pointer-events-none", "translate-y-1", "opacity-0"] : ["visible", "translate-y-0", "opacity-100"],
          yes ? ["visible", "translate-y-0", "opacity-100"] : ["invisible", "pointer-events-none", "translate-y-1", "opacity-0"]);
      });
    }));
    const carousel = root.querySelector('[aria-label="GreyLabel solution carousel"]');
    const movement = (direction) => carousel?.scrollBy({
      left: direction * Math.max(280, carousel.clientWidth * .78), behavior: "smooth"
    });
    root.querySelector('button[aria-label="Previous solutions"]')?.addEventListener("click", () => movement(-1));
    root.querySelector('button[aria-label="Next solutions"]')?.addEventListener("click", () => movement(1));
  }
  function initArticle(route) {
    const page = root.querySelector(".kg-page-content");
    if (!page) return;
    const hero = page.querySelector(".page-hero");
    if (hero && config.backgrounds[route.slice(1)]) {
      const image = document.createElement("img");
      image.src = config.backgrounds[route.slice(1)];
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
      image.className = "pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover object-center";
      const scrim = document.createElement("div");
      scrim.setAttribute("aria-hidden", "true");
      scrim.className = "pointer-events-none absolute inset-0 -z-20 bg-slate-950/48 backdrop-blur-[1.5px]";
      hero.prepend(image, scrim);
      hero.classList.add("!relative","!isolate","!overflow-hidden","!bg-transparent","!bg-none","!text-white",
        "!min-h-0","!pt-[122px]","!pb-10","sm:!pt-[136px]","sm:!pb-12");
      hero.querySelector(".hero-grid")?.classList.add("!grid-cols-1","!gap-0","!max-w-[980px]");
      hero.querySelector(".hero-copy")?.classList.add("!flex","!max-w-[900px]","!flex-col","!items-start");
      ["overline","hero-actions","hero-art"].forEach((name) => hero.querySelector("." + name)?.classList.add("!hidden"));
      hero.querySelector("h1")?.classList.add("!order-2","!m-0","!max-w-[900px]","!text-white",
        "!text-[clamp(2.2rem,5vw,4.4rem)]","!leading-[1.02]","max-[640px]:!text-[clamp(1.8rem,8vw,2.35rem)]",
        "max-[640px]:!leading-[1.08]","drop-shadow-[0_3px_18px_rgba(15,23,42,.5)]");
      hero.querySelector(".lead-paragraph")?.classList.add("!order-3","!mt-4","!mb-0","!max-w-[760px]","!text-base",
        "!leading-7","!text-white/86","sm:!text-lg","max-[640px]:!text-[.94rem]","max-[640px]:!leading-6",
        "drop-shadow-[0_3px_18px_rgba(15,23,42,.45)]");
      const crumbs = hero.querySelector(".breadcrumbs");
      if (crumbs) {
        crumbs.classList.add("!order-1","!mb-5","!mt-0","!inline-flex","!w-fit","!items-center","!gap-2",
          "!rounded-full","!border","!border-white/25","!bg-white/12","!px-3.5","!py-2","!text-[.7rem]",
          "!font-extrabold","!uppercase","!tracking-[.1em]","!text-white","!shadow-[0_12px_34px_rgba(15,23,42,.18)]","!backdrop-blur-xl");
        crumbs.querySelector("a")?.classList.add("!text-white/78","hover:!text-white");
        const spans = crumbs.querySelectorAll("span");
        if (spans[0]) { spans[0].textContent = "→"; spans[0].classList.add("!text-white/45"); }
        if (spans[1]) spans[1].classList.add("!rounded-full","!bg-white/14","!px-2.5","!py-1","!text-white");
      }
    }
    page.querySelectorAll(".art-bubble,.float,.runtime,.hero-ui .progress,.hero-ui .files,.related-card")
      .forEach((node) => node.classList.add("!border-white/20","!bg-white/10",
        "!shadow-[0_20px_60px_rgba(10,3,20,.22)]","!backdrop-blur-2xl","supports-[backdrop-filter]:!bg-white/8"));
    page.querySelector(".page-sidebar")?.classList.add("max-[880px]:!hidden");
    page.querySelectorAll(".chapter-tag,.bottom-cta").forEach((node) => node.classList.add("!hidden"));
    const help = page.querySelector(".sidebar-help");
    if (help) {
      help.classList.add("!bg-[#321543]","!text-white","!shadow-[0_16px_42px_rgba(50,21,67,.22)]","!backdrop-blur-xl");
      help.querySelector("p")?.classList.add("!text-violet-100/80");
      help.querySelector("a")?.classList.add("!text-white","!font-extrabold");
      help.querySelector("b")?.classList.add("!text-white");
    }
    for (const script of config.scripts[route] || []) {
      const node = document.createElement("script");
      node.text = script;
      page.appendChild(node);
    }
  }
  function render() {
    const { route, section } = view();
    if (current !== route) {
      clearInterval(heroTimer);
      heroTimer = null;
      const template = templates.get(route);
      if (!template) return;
      root.replaceChildren(template.content.cloneNode(true));
      current = route;
      if (route === "/") initHome();
      else initArticle(route);
      closeMenu();
      document.querySelectorAll("nav a[href^='#/']").forEach((link) => {
        if (link.getAttribute("href").split("?")[0] === "#" + route) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }
    document.title = config.meta[route]?.title || document.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = config.meta[route]?.description || "";
    requestAnimationFrame(() => {
      if (section) document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
      else scrollTo({ top: 0, behavior: "instant" });
    });
  }
  initChrome();
  addEventListener("hashchange", render);
  render();
})();
