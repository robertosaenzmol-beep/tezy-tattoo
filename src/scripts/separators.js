import { $$, reduce } from './utils.js';

/* ---------- Separador: máquina de bobinas que dibuja ---------- */
const MACH=`<path d="M58,-120 Q92,-112 104,-150 Q112,-176 132,-182"/>
<rect class="so" x="52" y="-152" width="7" height="50" rx="1.5"/>
<path d="M55,-152 L55,-164 L35,-164 L35,-158"/>
<path d="M44,-143 l3,-5 l3,5 l3,-5 l3,5"/>
<rect class="so" x="11" y="-136" width="14" height="32" rx="3"/><rect class="so" x="29" y="-136" width="14" height="32" rx="3"/>
<path d="M11,-128h14M11,-120h14M11,-112h14M29,-128h14M29,-120h14M29,-112h14"/>
<rect class="so" x="6" y="-145" width="46" height="6" rx="1.5"/>
<rect class="so" x="31" y="-172" width="7" height="12" rx="1"/><path d="M34.5,-176 L34.5,-146"/><circle class="so" cx="34.5" cy="-178" r="3.5"/>
<rect class="so" x="-9" y="-106" width="68" height="7" rx="2"/>
<path d="M5,-139 L1,-106"/>
<rect class="so" x="-10" y="-110" width="16" height="12" rx="2"/>
<rect class="so" x="-3.5" y="-98" width="7" height="40" rx="1"/>
<rect class="so" x="-6.5" y="-60" width="13" height="42" rx="3"/>
<path d="M-6.5,-54h13M-6.5,-49h13M-6.5,-44h13M-6.5,-39h13M-6.5,-34h13M-6.5,-29h13M-6.5,-24h13"/>
<path class="so" d="M-5,-18 L5,-18 L2.6,-8 L-2.6,-8 Z"/>
<line class="ndl" x1="0" y1="-8" x2="0" y2="0"/>`;
$$('[data-sep]').forEach(el=>{
  const svg=el.querySelector('svg');let W=0,L=0,t=reduce?1:0,ink,mach,ndl,started=false,scale=1;
  function build(){W=svg.clientWidth;const H=210,base=168;scale=W<600?.72:1;
    const x0=Math.max(W*.06,90*scale),x1=W-Math.max(W*.04,20);let d='';
    for(let x=x0;x<=x1;x+=5){const y=base+10*Math.sin(x*.03)+5*Math.sin(x*.071+1);d+=(d?'L':'M')+x.toFixed(1)+','+y.toFixed(1)}
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    svg.innerHTML=`<path class="ink" d="${d}"/><g class="mach">${MACH}</g>`;
    ink=svg.querySelector('.ink');mach=svg.querySelector('.mach');ndl=svg.querySelector('.ndl');
    L=ink.getTotalLength();ink.style.strokeDasharray=L;render(t,false)}
  function render(k,buzz){const p=ink.getPointAtLength(k*L),j=buzz?(Math.random()-.5)*1.6:0;
    ink.style.strokeDashoffset=L*(1-k);
    mach.setAttribute('transform',`translate(${(p.x+j).toFixed(2)},${(p.y+j*.5).toFixed(2)}) rotate(-22) scale(${scale})`);
    ndl.setAttribute('y1',buzz&&Math.random()<.5?-5:-8)}
  function run(){const t0=performance.now(),dur=3400;
    const f=now=>{const k=Math.min((now-t0)/dur,1);t=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;render(t,k<1);
      if(k<1)requestAnimationFrame(f);else el.classList.add('drawn')};requestAnimationFrame(f)}
  build();if(reduce)el.classList.add('drawn');
  new IntersectionObserver((es,o)=>{if(es[0].isIntersecting&&!started&&!reduce){started=true;o.disconnect();run()}},{threshold:.6}).observe(el);
  let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(build,150)});
});

