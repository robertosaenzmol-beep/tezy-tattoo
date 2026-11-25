import { $, $$, esc, reduce, go } from './utils.js';
import { artistName } from '../data/site.js';

/* ---------- Estado del formulario ---------- */
export const S = {};
export function pick(g, v) { S[g] = v; $$(`[data-g="${g}"] .chip`).forEach((c) => c.setAttribute('aria-pressed', c.dataset.v === v)); }
$$('[data-g]').forEach((el) => el.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) pick(el.dataset.g, b.dataset.v); }));

/* ---------- Maniquí de zonas ---------- */
const ZB={sh:'M86,65 Q70,64 58,70 Q47,78 47,95 L62,97 Q66,82 80,74 Z',
 ch:'M86,65 Q94,68 100,69 L100,116 Q84,120 70,114 L66,98 Q68,84 80,74 Z',
 rb:'M66,98 L70,114 Q72,140 74,168 L66,166 Q62,140 62,120 Q62,106 66,98 Z',
 ua:'M48,96 L61,98 Q58,124 55,150 L41,148 Q41,120 48,96 Z',
 fa:'M41,151 L55,153 Q51,180 47,204 L36,202 Q37,176 41,151 Z',
 hd:'M36,205 L47,207 Q50,219 47,233 Q41,241 35,235 Q31,221 36,205 Z',
 th:'M64,202 Q82,208 99,216 L96,292 L72,292 Q64,250 64,202 Z',
 sn:'M72,296 L96,296 Q95,340 92,382 L79,382 Q72,340 72,296 Z',
 ft:'M79,385 L92,385 Q96,398 98,408 Q86,413 72,409 Q76,396 79,385 Z'};
const ZC={nk:'M90,47 Q100,53 110,47 L113,63 Q100,67 87,63 Z',
 ab:'M70,115 Q100,123 130,115 Q128,140 126,168 Q100,174 74,168 Q72,140 70,115 Z',
 pv:'M66,167 L74,169 Q100,175 126,169 L134,167 Q138,186 136,200 Q118,206 100,214 Q82,206 64,200 Q62,186 66,167 Z'};
const FR={sh:['sh','Hombro',1],ch:['ch','Pecho',1],rb:['rb','Costillas',1],ua:['ua','Brazo',1],fa:['fa','Antebrazo',1],hd:['hd','Mano',1],th:['th','Muslo',1],sn:['sn','Espinilla',1],ft:['ft','Pie',1],nk:['nk','Cuello',0],ab:['ab','Abdomen',0],pv:['pv','Cadera',0]};
const BK={sh:['sh','Hombro',1],ch:['ea','Espalda alta',0],rb:['rb','Costillas',1],ua:['uab','Brazo, parte de atrás',1],fa:['fab','Antebrazo, exterior',1],hd:['hdb','Mano, dorso',1],th:['thb','Muslo, parte de atrás',1],sn:['snb','Gemelo',1],ft:['ftb','Tobillo',1],nk:['nkb','Nuca',0],ab:['abb','Espalda baja',0],pv:['pvb','Glúteos',0]};
const NAMES={otra:'Otra zona'};
function face(F,back){
  const z=(k,side)=>{const[id,n,p]=F[k],zid=p?id+'-'+side:id,nm=p?`${n} · lado ${side==='d'?'derecho':'izquierdo'}`:n;NAMES[zid]=nm;
    return`<path d="${ZB[k]||ZC[k]}" data-z="${zid}" tabindex="${back?-1:0}" role="button" aria-label="${esc(nm)}"/>`};
  const half=s=>Object.keys(ZB).map(k=>z(k,s)).join('');
  const g=back?'gb':'gf';
  return`<svg viewBox="18 0 164 420" style="--zf:url(#${g})" aria-label="Cuerpo, ${back?'espalda':'delante'}"><defs><linearGradient id="${g}" x1="${back?1:0}" y1="0" x2="${back?0:1}" y2="1"><stop offset="0" stop-color="#f8f8f8" stop-opacity=".2"/><stop offset="1" stop-color="#f8f8f8" stop-opacity=".04"/></linearGradient></defs>
  <ellipse class="deco" cx="100" cy="27" rx="15" ry="19"/>${['nk','ab','pv'].map(k=>z(k)).join('')}
  <g>${half(back?'i':'d')}</g><g transform="translate(200 0) scale(-1 1)">${half(back?'d':'i')}</g>${back?'<path class="spine" d="M100,66 L100,170"/>':''}</svg>`}
$('#bzf').innerHTML=face(FR,false);$('#bzb').innerHTML=face(BK,true);
const BZ=$('#bz'),BZZ=$('#bzz'),BZR=$('#bzr'),zsel=new Set(),touchUI=matchMedia('(hover: none)').matches;
const HINT=touchUI?'Toca para ampliar y otra vez para elegir · desliza para girar':'Pasa el cursor para ampliar · arrastra para girar';
let rot=0,tRot=0,tx=0,ty=0,cx2=0,cy2=0,raf=0,drag=null,zoomO=null,zoomId=null,outT,hovId=null;
const K=reduce?1:.14;
function setBack(b){BZ.classList.toggle('back',b);$('#bzl').textContent=b?'Espalda':'Delante';$('#bzflip').textContent=b?'Ver delante ↻':'Ver espalda ↻';
  $$('#bzf [data-z]').forEach(p=>p.setAttribute('tabindex',b?-1:0));$$('#bzb [data-z]').forEach(p=>p.setAttribute('tabindex',b?0:-1))}
function tick(){rot+=(tRot-rot)*K;cx2+=(tx-cx2)*.12;cy2+=(ty-cy2)*.12;
  BZR.style.transform=`rotateX(${cy2.toFixed(2)}deg) rotateY(${(rot+cx2).toFixed(2)}deg)`;
  const b=Math.cos(rot*Math.PI/180)<0;if(b!==BZ.classList.contains('back'))setBack(b);
  raf=(Math.abs(tRot-rot)>.05||Math.abs(tx-cx2)>.05||Math.abs(ty-cy2)>.05)?requestAnimationFrame(tick):0}
const kick=()=>{if(!raf)raf=requestAnimationFrame(tick)};
function hover(id){hovId=id;$$('#bz [data-z]').forEach(p=>p.classList.toggle('hov',p.dataset.z===id));
  const c=$('#bzcap');c.textContent=id?NAMES[id]:HINT;c.classList.toggle('hint',!id)}
function unzoom(){BZZ.classList.remove('zoom');zoomO=null;zoomId=null}
function zoomAt(x,y){BZZ.style.transformOrigin=`${x}px ${y}px`;BZZ.classList.add('zoom');zoomO=[x,y]}
function local(cx,cy){const r=BZ.getBoundingClientRect();let x=cx-r.left,y=cy-r.top;
  if(zoomO){const s=1.9;x=zoomO[0]+(x-zoomO[0])/s;y=zoomO[1]+(y-zoomO[1])/s}return[x,y]}
function paintZ(){$$('#bz [data-z]').forEach(p=>p.classList.toggle('sel',zsel.has(p.dataset.z)));
  $('#bzsel').innerHTML=`<button type="button" class="chip zs" data-zt="otra" aria-pressed="${zsel.has('otra')}">Otra zona (cabeza, cara…)</button>`+
    [...zsel].filter(z=>z!=='otra').map(z=>`<button type="button" class="chip zs" data-zt="${z}" aria-pressed="true" aria-label="Quitar ${esc(NAMES[z])}">${esc(NAMES[z])} ×</button>`).join('');
  S.zona=[...zsel].map(z=>NAMES[z]).join(', ')}
function toggleZ(id){zsel.has(id)?zsel.delete(id):zsel.add(id);paintZ();$('#err').textContent=''}
$('#bzsel').addEventListener('click',e=>{const b=e.target.closest('[data-zt]');if(b)toggleZ(b.dataset.zt)});
$('#bzflip').addEventListener('click',()=>{unzoom();tRot+=180;kick()});
const zAt=(x,y)=>{const el=document.elementFromPoint(x,y);return el&&BZ.contains(el)?el.closest('[data-z]'):null};
BZ.addEventListener('pointerdown',e=>{drag={x:e.clientX,r0:tRot,moved:false}});
BZ.addEventListener('pointermove',e=>{
  if(drag){const dx=e.clientX-drag.x;
    if(!drag.moved&&Math.abs(dx)>8){drag.moved=true;try{BZ.setPointerCapture(e.pointerId)}catch(_){}unzoom();hover(null)}
    if(drag.moved){tRot=drag.r0+dx*.8;rot=tRot;kick();return}}
  if(e.pointerType!=='mouse')return;
  const r=BZ.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width,ny=(e.clientY-r.top)/r.height;
  tx=(nx-.5)*16;ty=-(ny-.5)*9;kick();
  const z=e.target.closest&&e.target.closest('[data-z]');hover(z?z.dataset.z:null);
  if(z){clearTimeout(outT);BZZ.style.transformOrigin=`${e.clientX-r.left}px ${e.clientY-r.top}px`;BZZ.classList.add('zoom');zoomO=null}
  else{clearTimeout(outT);outT=setTimeout(()=>BZZ.classList.remove('zoom'),280)}});
BZ.addEventListener('pointerup',e=>{const d=drag;drag=null;
  if(d&&d.moved){tRot=Math.round(tRot/180)*180;kick();return}
  const z=zAt(e.clientX,e.clientY);
  if(e.pointerType==='mouse'){if(z)toggleZ(z.dataset.z);return}
  if(!z){unzoom();hover(null);return}
  const id=z.dataset.z;
  if(zoomId===id){toggleZ(id);return}
  const rr=z.getBoundingClientRect(),[x,y]=local(rr.left+rr.width/2,rr.top+rr.height/2);zoomAt(x,y);zoomId=id;hover(id)});
BZ.addEventListener('pointercancel',()=>{if(drag&&drag.moved){tRot=Math.round(tRot/180)*180;kick()}drag=null});
BZ.addEventListener('pointerleave',e=>{if(e.pointerType!=='mouse')return;tx=ty=0;kick();clearTimeout(outT);BZZ.classList.remove('zoom');hover(null)});
BZ.addEventListener('keydown',e=>{const z=e.target.closest('[data-z]');if(z&&(e.key==='Enter'||e.key===' ')){e.preventDefault();toggleZ(z.dataset.z)}});
BZ.addEventListener('focusin',e=>{const z=e.target.closest('[data-z]');if(z)hover(z.dataset.z)});
hover(null);paintZ();
let refs=[],portRef=null;
function thumbs(){$('#thumbs').innerHTML=(portRef!==null?`<div class="pf">Trabajo del portfolio n.º ${portRef+1}</div>`:'')+refs.map(u=>`<img src="${u}" alt="Referencia">`).join('')}
$('#t-ref').addEventListener('change',e=>{for(const f of [...e.target.files]){if(refs.length>=5)break;if(f.type.startsWith('image/'))refs.push(URL.createObjectURL(f))}thumbs()});

let step=1;const N=4;
function show(){$$('.step').forEach(s=>s.classList.toggle('on',+s.dataset.s===step));$('#pi').style.width=(step/N*100)+'%';
  $('#sn').textContent=`Paso ${step} de ${N}`;$('#back').style.visibility=step>1?'visible':'hidden';$('#next').textContent=step<N?'Siguiente':'Enviar mi idea';$('#err').textContent=''}
function valid(){const err=$('#err');
  if(step===1&&$('#t-idea').value.trim().length<8){err.textContent='Cuéntanos un poco más de tu idea.';return false}
  if(step===2&&!zsel.size){err.textContent='Toca al menos una zona del cuerpo.';return false}
  if(step===4){if(!$('#t-nom').value.trim()){err.textContent='Falta tu nombre.';return false}
    if($('#t-tel').value.replace(/\D/g,'').length<9){err.textContent='Revisa el teléfono: necesitamos 9 cifras para escribirte.';return false}
    if(!$('#t-ok').checked){err.textContent='Marca la casilla para poder responderte.';return false}}
  return true}
$('#back').onclick=()=>{step--;show()};
$('#f').addEventListener('submit',e=>{e.preventDefault();if(!valid())return;if(step<N){step++;show();go('idea');return}finish()});
function finish(){
  const nom=$('#t-nom').value.trim(),art=S.artista&&S.artista!=='igual'?artistName(S.artista):'el estudio';
  const nRef=refs.length+(portRef!==null?1:0);
  const rows=[['Idea',$('#t-idea').value.trim()],['Estilo',S.estilo||'Sin decidir'],['Zona',S.zona||'—'],['Tamaño',S.tam||'Sin decidir'],['Referencias',nRef?`${nRef} imagen${nRef>1?'es':''}`:'Ninguna'],['Artista',S.artista?artistName(S.artista==='igual'?'':S.artista):'Me da igual'],['Nos conociste por',S.origen||'Sin indicar']];
  $('#done').innerHTML=`<h3>¡Hecho, ${esc(nom)}!</h3><p class="lead">Tu idea ya está en manos de ${esc(art)}.</p>
   <dl class="sum">${rows.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd style="margin:0">${esc(v)}</dd></div>`).join('')}</dl>
   <ul class="next"><li>El artista la revisa y te escribe por WhatsApp con el presupuesto.</li><li>Si te encaja, reservas la cita con una señal.</li><li>Una semana antes te recordamos la cita.</li></ul>
   <div class="demo">Demo: en la versión real esta solicitud aparece al momento en el panel de ${esc(art==='el estudio'?'admin':art)}, etiquetada con origen «${esc(S.origen||'Web')}».</div>
   <button class="btn ghost" id="again" type="button">Enviar otra idea</button>`;
  $('#f').style.display='none';$('#done').classList.add('on');go('idea');
  $('#again').onclick=()=>{$('#f').reset();for(const k in S)delete S[k];$$('[data-g] .chip').forEach(c=>c.setAttribute('aria-pressed','false'));refs=[];portRef=null;thumbs();zsel.clear();paintZ();tRot=0;kick();step=1;show();$('#done').classList.remove('on');$('#f').style.display=''};
}
show();


/* Llamado desde el portfolio: "quiero algo así" */
export function likeWork(i, artist, style) { portRef = i; pick('estilo', style); pick('artista', artist); thumbs(); go('idea'); }
