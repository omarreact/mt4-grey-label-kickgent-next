const timelineSteps = [
  {
    title: "Discovery",
    text: "Clarify the brokerage model, target clients, platform requirements and operational dependencies.",
    detail: "Business goals · platform scope · compliance dependencies",
    icon: "compass",
  },
  {
    title: "Architecture",
    text: "Map how the trading platform, CRM, payments, liquidity, website and managed-account tools connect.",
    detail: "System map · API scope · ownership boundaries",
    icon: "layers",
  },
  {
    title: "Configuration",
    text: "Configure branding, groups, permissions and client workflows around the agreed operating model.",
    detail: "Brand assets · trading groups · client workflows",
    icon: "settings",
  },
  {
    title: "Integration & QA",
    text: "Validate account creation, funding, trading access, reporting and the exception paths between systems.",
    detail: "Staging checks · mobile QA · workflow validation",
    icon: "shield",
  },
  {
    title: "Launch & support",
    text: "Move live with monitored hand-off, change control and a clear route for post-launch adjustments.",
    detail: "Go-live checklist · support · growth roadmap",
    icon: "rocket",
  },
] as const;

function TimelineIcon({ name }: { name: (typeof timelineSteps)[number]["icon"] }) {
  const common = "size-5";
  if (name === "compass") {
    return <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>;
  }
  if (name === "layers") {
    return <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none"><path d="m12 4 8 4-8 4-8-4 8-4Zm-8 8 8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
  if (name === "settings") {
    return <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none"><path d="M4 7h10M18 7h2M4 17h2m4 0h10M14 4v6M6 14v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="6" cy="17" r="2" stroke="currentColor" strokeWidth="1.8"/></svg>;
  }
  if (name === "shield") {
    return <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none"><path d="M12 3 19 6v5c0 4.3-2.7 7.8-7 10-4.3-2.2-7-5.7-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m8.8 12 2.1 2.1 4.5-4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none"><path d="M14 5c3.2.5 5 2.3 5.5 5.5L15 15l-6-6L14 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m9 9-3 1-2 3 5 2 2 5 3-2 1-3M14.5 9.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none"><path d="M4 10h12m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function SharedClosingSections() {
  return (
    <>
      <section id="how-it-works" data-global-how-it-works className="relative isolate h-fit overflow-hidden px-4 py-20 text-white sm:px-6 sm:py-24">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2200&q=86"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-30 size-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 -z-20 bg-slate-950/58 backdrop-blur-[2px]" />

        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[780px] text-center">
            <span className="text-xs font-extrabold tracking-[.18em] text-fuchsia-200">HOW IT WORKS</span>
            <h2 className="mt-4 text-balance text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-.055em]">
              A connected timeline from discovery to launch
            </h2>
            <p className="mx-auto mt-5 max-w-[700px] text-sm leading-7 text-violet-100/75 sm:text-base sm:leading-8">
              Every milestone has a clear output and verification point, so platform, CRM and operational work stay connected throughout implementation.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-7 top-0 bottom-0 hidden border-l border-fuchsia-200/25 sm:block lg:left-0 lg:right-0 lg:top-7 lg:bottom-auto lg:border-l-0 lg:border-t" aria-hidden="true" />
            <div className="grid gap-5 lg:grid-cols-5 lg:gap-4">
              {timelineSteps.map((step) => (
                <article key={step.title} className="relative h-fit pl-0 sm:pl-16 lg:pl-0 lg:pt-14">
                  <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-white/12 text-fuchsia-100 shadow-[0_14px_38px_rgba(10,3,20,.2)] backdrop-blur-2xl sm:absolute sm:left-1 sm:top-0 sm:mb-0 lg:left-0 lg:top-0">
                    <TimelineIcon name={step.icon} />
                  </span>
                  <div className="h-fit rounded-[22px] bg-white/[.075] p-5 shadow-[0_20px_55px_rgba(8,2,14,.18)] backdrop-blur-2xl">
                    <h3 className="text-lg font-bold tracking-[-.03em]">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-violet-100/72">{step.text}</p>
                    <p className="mt-5 text-xs font-semibold leading-5 text-fuchsia-100/75">{step.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-global-cta className="h-fit bg-[#100414] px-4 py-14 text-white sm:px-6 sm:py-18">
        <div className="mx-auto flex h-fit max-w-[1180px] flex-col gap-8 overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_82%_20%,rgba(217,70,239,.22),transparent_32%),linear-gradient(135deg,rgba(124,58,237,.22),rgba(255,255,255,.04))] p-7 shadow-[0_30px_85px_rgba(8,2,14,.26)] backdrop-blur-2xl sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[720px]">
            <span className="text-xs font-extrabold tracking-[.18em] text-fuchsia-200">START WITH THE RIGHT FOUNDATION</span>
            <h2 className="mt-4 text-balance text-[clamp(2.2rem,5vw,4.3rem)] font-semibold leading-[1.02] tracking-[-.055em]">
              Build a brokerage stack that can grow without becoming fragmented.
            </h2>
            <p className="mt-5 max-w-[650px] text-sm leading-7 text-violet-100/75 sm:text-base">
              Tell us what you want to launch, which systems you already have and where your operational bottlenecks are.
            </p>
          </div>
          <a
            data-bottom-cta-button
            href="mailto:admin@pincodeit.com?subject=MT4%20Grey%20Label%20Technology%20Consultation"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f0e7fb] px-5 text-sm font-extrabold !text-[#4a1f5f] shadow-xl transition hover:-translate-y-0.5 hover:bg-white"
          >
            Talk to our team <ArrowIcon />
          </a>
        </div>
      </section>
    </>
  );
}
