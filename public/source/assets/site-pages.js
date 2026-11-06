(()=>{'use strict';
const toggle=document.querySelector('[data-nav-toggle]');
const nav=document.querySelector('#site-navigation');
const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
function closeAll(){for(const d of dropdowns){d.classList.remove('open');d.querySelector('button')?.setAttribute('aria-expanded','false')}}
function closeNav(){nav?.classList.remove('is-open');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Open navigation');if(toggle)toggle.textContent='☰';closeAll()}
toggle?.addEventListener('click',()=>{const open=nav?.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(!!open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');toggle.textContent=open?'×':'☰';if(!open)closeAll()});
dropdowns.forEach(d=>{const btn=d.querySelector('button');btn?.addEventListener('click',()=>{const open=d.classList.contains('open');closeAll();d.classList.toggle('open',!open);btn.setAttribute('aria-expanded',String(!open))})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeNav();toggle?.focus()}});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.header-shell'))closeNav()});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
addEventListener('resize',()=>{if(innerWidth>880)closeNav()});
const progress=document.querySelector('.progress-track');
const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.transform='scaleX('+(max>0?scrollY/max:0)+')'};
addEventListener('scroll',update,{passive:true});update();
const links=[...document.querySelectorAll('.toc-links a')];
if('IntersectionObserver' in window){const sections=links.map(a=>document.getElementById(a.hash.slice(1))).filter(Boolean);const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.hash.slice(1)===e.target.id))}}},{rootMargin:'-20% 0px -70% 0px'});sections.forEach(s=>observer.observe(s))}
})();