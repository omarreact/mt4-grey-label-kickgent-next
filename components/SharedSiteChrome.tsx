"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = readonly [string, string];
const solutions: readonly NavItem[] = [
  ["MT4 Grey Label","mt4-grey-label"],
  ["MT5 Grey Label","mt5-grey-label"],
  ["Forex Broker CRM","forex-broker-crm"],
  ["PAMM & MAM Plugins","pamm-mam"],
  ["Liquidity & Bridge","forex-liquidity-bridge"],
  ["Broker Website","forex-broker-website"],
];
const guides: readonly NavItem[] = [
  ["Start a Brokerage","how-to-start-forex-brokerage"],
  ["Scale Your Brokerage","scale-forex-brokerage"],
  ["Turnkey Brokerage","turnkey-grey-label"],
];

const desktopNavItem = "inline-flex min-h-11 items-center gap-1.5 py-2 text-[.84rem] font-semibold leading-none text-[#e9dff0] no-underline transition-colors hover:text-white focus-visible:text-white";
const mobileNavItem = "max-[880px]:w-full max-[880px]:justify-between max-[880px]:border-b max-[880px]:border-white/10";

function Brand() {
  return <Link href="/" className="inline-flex items-center gap-2.5 whitespace-nowrap text-[1.2rem] font-extrabold tracking-[-.05em] text-white no-underline max-[430px]:text-[1.05rem]">
    <span
      className="block size-7 rounded-full bg-[conic-gradient(#d1a1ff,#7826dc,#34105e,#d1a1ff)] drop-shadow-[0_0_8px_#b15dff]"
      style={{ WebkitMask: "radial-gradient(circle,transparent 31%,#000 33%)", mask: "radial-gradient(circle,transparent 31%,#000 33%)" }}
      aria-hidden="true"
    />
    GreyLabel
  </Link>;
}

function MenuGroup({label,items,id,open,onToggle,onNavigate}:{label:string;items:readonly NavItem[];id:string;open:boolean;onToggle:()=>void;onNavigate:()=>void}) {
  return <div className="relative w-auto max-[880px]:w-full">
    <button
      type="button"
      aria-expanded={open}
      aria-controls={id}
      onClick={onToggle}
      className={desktopNavItem+" "+mobileNavItem+" border-0 bg-transparent"}
    >
      {label}<span aria-hidden="true">⌄</span>
    </button>
    <div
      id={id}
      className="absolute left-1/2 top-[calc(100%+8px)] grid min-w-[248px] -translate-x-1/2 rounded-[13px] border border-[#dfbef652] bg-[#1d0929] p-[9px] shadow-[0_20px_45px_#0009] max-[880px]:static max-[880px]:mb-[7px] max-[880px]:min-w-0 max-[880px]:translate-x-0 max-[880px]:border-0 max-[880px]:border-l-2 max-[880px]:border-l-[#d49aff] max-[880px]:bg-transparent max-[880px]:py-[7px] max-[880px]:pl-[13px] max-[880px]:shadow-none"
      hidden={!open}
    >
      {items.map(([name,slug]) => <Link
        href={"/"+slug}
        key={slug}
        onClick={onNavigate}
        className="rounded-lg px-2.5 py-2.5 text-[.8rem] font-semibold leading-[1.35] text-[#eadcf2] no-underline hover:bg-white/10 hover:text-white max-[880px]:px-3.5 max-[880px]:py-3"
      >{name}</Link>)}
    </div>
  </div>;
}

export function SharedSiteHeader() {
  const [mobileOpen,setMobileOpen]=useState(false);
  const [expanded,setExpanded]=useState<"solutions"|"guides"|null>(null);
  const path=usePathname();
  const close=()=>{setMobileOpen(false);setExpanded(null);};

  useEffect(()=>{
    const esc=(event:KeyboardEvent)=>{if(event.key==="Escape")close();};
    window.addEventListener("keydown",esc);
    return()=>window.removeEventListener("keydown",esc);
  },[]);

  const active=(href:string)=>path===href;

  return <header className="sticky top-0 z-[500] border-b border-[#dcAAff2e] bg-[rgba(11,3,17,.94)] backdrop-blur-[18px]">
    <div className="relative mx-auto flex min-h-[76px] w-[min(1180px,calc(100%_-_40px))] items-center gap-[22px] max-[880px]:min-h-[68px] max-[880px]:w-[calc(100%_-_32px)] max-[430px]:gap-2.5">
      <Brand />
      <button
        className="kg-global-menu ml-auto hidden size-11 min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-[#c88df8] bg-white/5 text-[1.3rem] text-white max-[880px]:inline-flex"
        type="button"
        aria-label={mobileOpen?"Close navigation":"Open navigation"}
        aria-expanded={mobileOpen}
        aria-controls="kg-primary-navigation"
        onClick={()=>{setMobileOpen(value=>!value);setExpanded(null);}}
      >{mobileOpen?"×":"☰"}</button>

      <nav
        id="kg-primary-navigation"
        className={[
          "flex flex-1 items-center justify-center gap-[21px]",
          "max-[880px]:absolute max-[880px]:left-0 max-[880px]:right-0 max-[880px]:top-full max-[880px]:max-h-[calc(100dvh_-_68px)] max-[880px]:flex-col max-[880px]:items-stretch max-[880px]:gap-0 max-[880px]:overflow-y-auto max-[880px]:rounded-b-[14px] max-[880px]:border max-[880px]:border-t-0 max-[880px]:border-[#d5a8fa40] max-[880px]:bg-[#15061f] max-[880px]:px-4 max-[880px]:pb-[18px] max-[880px]:pt-3 max-[880px]:shadow-[0_24px_40px_#0008]",
          mobileOpen ? "max-[880px]:flex" : "max-[880px]:hidden",
        ].join(" ")}
        aria-label="Primary navigation"
      >
        <Link href="/" aria-current={active("/")?"page":undefined} onClick={close} className={desktopNavItem+" "+mobileNavItem+(active("/")?" !text-[#d69aff]":"")}>Home</Link>
        <MenuGroup label="Solutions" id="kg-solutions-menu" items={solutions} open={expanded==="solutions"} onToggle={()=>setExpanded(expanded==="solutions"?null:"solutions")} onNavigate={close}/>
        <MenuGroup label="Guides" id="kg-guides-menu" items={guides} open={expanded==="guides"} onToggle={()=>setExpanded(expanded==="guides"?null:"guides")} onNavigate={close}/>
        <Link href="/about" aria-current={active("/about")?"page":undefined} onClick={close} className={desktopNavItem+" "+mobileNavItem+(active("/about")?" !text-[#d69aff]":"")}>About</Link>
      </nav>

      <a
        className="inline-flex min-h-[43px] items-center justify-center whitespace-nowrap rounded-[10px] bg-[linear-gradient(135deg,#8138db,#b567ff)] px-[15px] text-[.8rem] font-bold leading-none text-white no-underline max-[880px]:hidden"
        href="mailto:admin@pincodeit.com?subject=GreyLabel%20Enquiry"
      >Get Started ↗</a>
    </div>
  </header>;
}

export function SharedSiteFooter() {
  return <footer className="bg-[#0d0312] pb-6 pt-[60px] text-white max-[720px]:pt-[46px]">
    <div className="mx-auto w-[min(1180px,calc(100%_-_40px))] max-[720px]:w-[calc(100%_-_32px)]">
      <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-[38px] max-[720px]:grid-cols-1 max-[720px]:gap-7">
        <div>
          <Brand />
          <p className="mt-[18px] max-w-[370px] text-[.85rem] leading-[1.7] text-[#c8b3d3]">
            MT4 & MT5 grey label solutions, CRM, PAMM/MAM plugins, liquidity connectivity and broker websites.
          </p>
        </div>
        <div>
          <strong className="mb-4 block text-[.88rem] font-extrabold">Solutions</strong>
          {solutions.slice(0,4).map(([name,slug])=><Link className="mb-[11px] block w-fit text-[.82rem] font-semibold leading-[1.4] text-[#d8c4e2] no-underline hover:text-white hover:underline" href={"/"+slug} key={slug}>{name}</Link>)}
        </div>
        <div>
          <strong className="mb-4 block text-[.88rem] font-extrabold">Explore</strong>
          {guides.map(([name,slug])=><Link className="mb-[11px] block w-fit text-[.82rem] font-semibold leading-[1.4] text-[#d8c4e2] no-underline hover:text-white hover:underline" href={"/"+slug} key={slug}>{name}</Link>)}
          <Link className="mb-[11px] block w-fit text-[.82rem] font-semibold leading-[1.4] text-[#d8c4e2] no-underline hover:text-white hover:underline" href="/about">About & Why Choose Us</Link>
        </div>
      </div>
      <div className="mt-[46px] border-t border-white/10 pt-5 text-[.74rem] leading-[1.4] text-[#a991b5]">
        © 2026 GreyLabel Technology. Technology services only — not investment advice.
      </div>
    </div>
  </footer>;
}
