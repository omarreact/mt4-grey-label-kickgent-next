"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = readonly [string, string];
const solutions: readonly NavItem[] = [["MT4 Grey Label","mt4-grey-label"],["MT5 Grey Label","mt5-grey-label"],["Forex Broker CRM","forex-broker-crm"],["PAMM & MAM Plugins","pamm-mam"],["Liquidity & Bridge","forex-liquidity-bridge"],["Broker Website","forex-broker-website"]];
const guides: readonly NavItem[] = [["Start a Brokerage","how-to-start-forex-brokerage"],["Scale Your Brokerage","scale-forex-brokerage"],["Turnkey Brokerage","turnkey-grey-label"]];

function MenuGroup({label,items,id,open,onToggle,onNavigate}:{label:string;items:readonly NavItem[];id:string;open:boolean;onToggle:()=>void;onNavigate:()=>void}) {
  return <div className="kg-nav-group">
    <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle}>{label}<span aria-hidden="true">⌄</span></button>
    <div id={id} className="kg-nav-panel" hidden={!open}>{items.map(([name,slug]) => <Link href={"/"+slug} key={slug} onClick={onNavigate}>{name}</Link>)}</div>
  </div>;
}

export function SharedSiteHeader() {
  const [mobileOpen,setMobileOpen]=useState(false);
  const [expanded,setExpanded]=useState<"solutions"|"guides"|null>(null);
  const path=usePathname();
  const close=()=>{setMobileOpen(false);setExpanded(null);};
  useEffect(()=>{const esc=(event:KeyboardEvent)=>{if(event.key==="Escape")close();};window.addEventListener("keydown",esc);return()=>window.removeEventListener("keydown",esc);},[]);
  const active=(href:string)=>path===href?"page":undefined;
  return <>
    <style>{`
      .kg-global-header{position:sticky;top:0;z-index:500;background:rgba(11,3,17,.94);border-bottom:1px solid rgba(220,170,255,.18);backdrop-filter:blur(18px)}
      .kg-global-shell{position:relative;width:min(1180px,calc(100% - 40px));min-height:76px;margin:auto;display:flex;align-items:center;gap:22px}
      .kg-global-brand{display:inline-flex;align-items:center;gap:10px;color:#fff!important;font-size:1.2rem;font-weight:850;letter-spacing:-.05em;white-space:nowrap}
      .kg-global-mark{display:block;width:28px;height:28px;border-radius:50%;background:conic-gradient(#d1a1ff,#7826dc,#34105e,#d1a1ff);mask:radial-gradient(circle,transparent 31%,#000 33%);filter:drop-shadow(0 0 8px #b15dff)}
      .kg-global-nav{display:flex;align-items:center;justify-content:center;gap:21px;flex:1}.kg-global-nav>a,.kg-nav-group>button{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:8px 0;border:0;background:none;color:#e9dff0!important;font:650 .84rem/1 Inter,system-ui,sans-serif;cursor:pointer}.kg-global-nav>a[aria-current=page]{color:#d69aff!important}
      .kg-nav-group{position:relative}.kg-nav-panel{position:absolute;top:calc(100% + 8px);left:50%;display:grid;min-width:248px;padding:9px;border:1px solid rgba(223,190,246,.32);border-radius:13px;background:#1d0929;box-shadow:0 20px 45px #0009;transform:translateX(-50%)}.kg-nav-panel[hidden]{display:none}.kg-nav-panel a{padding:10px;color:#eadcf2!important;font:600 .8rem/1.35 Inter,system-ui,sans-serif}.kg-nav-panel a:hover{background:#ffffff12;color:#fff!important}
      .kg-global-cta{display:inline-flex;align-items:center;justify-content:center;min-height:43px;padding:0 15px;border-radius:10px;background:linear-gradient(135deg,#8138db,#b567ff);color:#fff!important;font:750 .8rem/1 Inter,system-ui,sans-serif;white-space:nowrap}.kg-global-menu{display:none;width:44px;height:44px;border:1px solid #c88df8;border-radius:10px;background:#ffffff0d;color:#fff;font-size:1.3rem}
      @media(max-width:880px){.kg-global-shell{width:calc(100% - 32px);min-height:68px}.kg-global-menu{display:inline-flex;align-items:center;justify-content:center;margin-left:auto}.kg-global-cta{display:none}.kg-global-nav{position:absolute;top:100%;left:0;right:0;display:none;align-items:stretch;gap:0;max-height:calc(100dvh - 68px);overflow-y:auto;flex-direction:column;padding:12px 16px 18px;background:#15061f;border:1px solid #d5a8fa40;border-top:0;border-radius:0 0 14px 14px;box-shadow:0 24px 40px #0008}.kg-global-nav.is-open{display:flex}.kg-global-nav>a,.kg-nav-group>button{width:100%;justify-content:space-between;border-bottom:1px solid #ffffff16}.kg-nav-group{width:100%}.kg-nav-panel{position:static;min-width:0;margin:0 0 7px;padding:5px 0 7px 13px;border:0;border-left:2px solid #d49aff;transform:none;box-shadow:none}.kg-nav-panel a{padding:12px 14px}.kg-nav-group>button[aria-expanded=true]{color:#fff!important}.kg-global-nav a:last-child{border-bottom:0}}
      .kg-global-footer{padding:60px 0 24px;background:#0d0312;color:#fff}.kg-footer-shell{width:min(1180px,calc(100% - 40px));margin:auto}.kg-footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:38px}.kg-footer-title{display:block;margin-bottom:16px;color:#fff;font:800 .88rem/1 Inter,system-ui,sans-serif}.kg-global-footer p{max-width:370px;margin:18px 0 0;color:#c8b3d3;font:400 .85rem/1.7 Inter,system-ui,sans-serif}.kg-global-footer a{display:block;width:fit-content;margin:0 0 11px;color:#d8c4e2!important;font:600 .82rem/1.4 Inter,system-ui,sans-serif}.kg-global-footer a:hover{color:#fff!important;text-decoration:underline}.kg-footer-bottom{margin-top:46px;padding-top:20px;border-top:1px solid #ffffff1c;color:#a991b5;font:400 .74rem/1.4 Inter,system-ui,sans-serif}@media(max-width:720px){.kg-footer-shell{width:calc(100% - 32px)}.kg-footer-grid{grid-template-columns:1fr;gap:28px}.kg-global-footer{padding-top:46px}}
    `}</style>
    <header className="kg-global-header"><div className="kg-global-shell">
      <Link href="/" className="kg-global-brand"><span className="kg-global-mark" aria-hidden="true" />GreyLabel</Link>
      <button className="kg-global-menu" type="button" aria-label={mobileOpen?"Close navigation":"Open navigation"} aria-expanded={mobileOpen} aria-controls="kg-primary-navigation" onClick={()=>{setMobileOpen(value=>!value);setExpanded(null);}}>{mobileOpen?"×":"☰"}</button>
      <nav id="kg-primary-navigation" className={"kg-global-nav"+(mobileOpen?" is-open":"")} aria-label="Primary navigation">
        <Link href="/" aria-current={active("/")} onClick={close}>Home</Link>
        <MenuGroup label="Solutions" id="kg-solutions-menu" items={solutions} open={expanded==="solutions"} onToggle={()=>setExpanded(expanded==="solutions"?null:"solutions")} onNavigate={close}/>
        <MenuGroup label="Guides" id="kg-guides-menu" items={guides} open={expanded==="guides"} onToggle={()=>setExpanded(expanded==="guides"?null:"guides")} onNavigate={close}/>
        <Link href="/about" aria-current={active("/about")} onClick={close}>About</Link>
      </nav>
      <a className="kg-global-cta" href="mailto:admin@pincodeit.com?subject=GreyLabel%20Enquiry">Get Started ↗</a>
    </div></header>
  </>;
}

export function SharedSiteFooter() {
  return <footer className="kg-global-footer"><div className="kg-footer-shell">
    <div className="kg-footer-grid">
      <div><Link href="/" className="kg-global-brand"><span className="kg-global-mark" aria-hidden="true" />GreyLabel</Link><p>MT4 & MT5 grey label solutions, CRM, PAMM/MAM plugins, liquidity connectivity and broker websites.</p></div>
      <div><strong className="kg-footer-title">Solutions</strong>{solutions.slice(0,4).map(([name,slug])=><Link href={"/"+slug} key={slug}>{name}</Link>)}</div>
      <div><strong className="kg-footer-title">Explore</strong>{guides.map(([name,slug])=><Link href={"/"+slug} key={slug}>{name}</Link>)}<Link href="/about">About & Why Choose Us</Link></div>
    </div>
    <div className="kg-footer-bottom">© 2026 GreyLabel Technology. Technology services only — not investment advice.</div>
  </div></footer>;
}
