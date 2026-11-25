import { $, $$, go } from './utils.js';

document.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) { e.preventDefault(); go(b.dataset.go); } });
$$('.dots a').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); go(a.getAttribute('href').slice(1)); }));

/* ---------- Puntos de navegación y CTA móvil ---------- */
const secs=['inicio','trabajos','estudio','idea','contacto'].map(id=>document.getElementById(id));
const inView={};
const io=new IntersectionObserver(es=>{es.forEach(e=>inView[e.target.id]=e.intersectionRatio);
  let best=secs[0].id,m=-1;secs.forEach(s=>{if((inView[s.id]||0)>m){m=inView[s.id]||0;best=s.id}});
  $$('.dots a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+best));
  $('#sticky').classList.toggle('on',(inView.inicio||0)<.15&&(inView.idea||0)<.05)},{threshold:[0,.05,.15,.3,.5,.7,1]});
secs.forEach(s=>io.observe(s));