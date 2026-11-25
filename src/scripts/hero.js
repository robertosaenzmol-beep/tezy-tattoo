import { $, reduce } from './utils.js';

/* ---------- Palabra gigante: ajustar al ancho ---------- */
const word=$('#word');
function fit(){
  const vw=innerWidth,mobile=vw<760;word.style.fontSize='100px';
  const spans=[...word.children];
  const w=mobile?Math.max(...spans.map(s=>s.getBoundingClientRect().width)):spans.reduce((a,s)=>a+s.getBoundingClientRect().width,0)+parseFloat(getComputedStyle(word).columnGap||0);
  const pad=Math.max(vw*.05,18)*2;word.style.fontSize=(100*(vw-pad)*.97/w)+'px';
}
(document.fonts?document.fonts.ready:Promise.resolve()).then(fit);
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(fit,120)});

/* ---------- Humo (WebGL) ---------- */
const cv=$('#smoke');const gl=cv.getContext('webgl',{antialias:false,alpha:false});
let draw=()=>{};
if(gl){
  const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs=`precision mediump float;uniform vec2 r;uniform float t;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
  float fb(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*n(p);p=m*p;a*=.5;}return v;}
  void main(){vec2 uv=gl_FragCoord.xy/r.y*1.4;float T=t*.6;
    vec2 q=vec2(fb(uv+vec2(0.,T*.04)),fb(uv+vec2(5.2,1.3)-T*.03));
    vec2 w=vec2(fb(uv+3.*q+vec2(1.7,9.2)+T*.05),fb(uv+3.*q+vec2(8.3,2.8)-T*.04));
    float f=fb(uv+3.2*w);
    float vein=pow(1.-abs(f*2.-1.),7.);
    float sm=smoothstep(.5,1.,f)*.55+vein*.4;
    vec2 c=gl_FragCoord.xy/r-.5;float vg=1.-.55*dot(c*vec2(1.,1.3),c*vec2(1.,1.3))*2.;
    vec3 col=vec3(.133)+vec3(.97)*sm*.5*vg;
    gl_FragColor=vec4(col,1.);}`;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
  if(gl.getProgramParameter(pr,gl.LINK_STATUS)){
    gl.useProgram(pr);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const ur=gl.getUniformLocation(pr,'r'),ut=gl.getUniformLocation(pr,'t');
    draw=time=>{gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(ur,cv.width,cv.height);gl.uniform1f(ut,time);gl.drawArrays(gl.TRIANGLES,0,3)};
  }
}
if(!gl)cv.style.background='radial-gradient(ellipse at 30% 40%,#3a3a3a,#222 60%)';

/* ---------- Chispas naranja/verde ---------- */
const sp=$('#sparks'),cx=sp.getContext('2d');let P=[];
const COLS=['232,134,47','166,187,90'];
function spawn(init){const W=sp.width,H=sp.height;return{x:Math.random()*W,y:init?Math.random()*H:H+10,vy:-(.15+Math.random()*.35)*devicePixelRatio,ph:Math.random()*6.28,s:(.8+Math.random()*1.4)*devicePixelRatio,life:0,max:4+Math.random()*5,c:COLS[Math.random()<.6?0:1]}}
function size(){const d=Math.min(devicePixelRatio||1,2),hero=$('#inicio');
  sp.width=hero.clientWidth*d;sp.height=hero.clientHeight*d;
  const q=innerWidth<760?.45:.6;cv.width=Math.round(hero.clientWidth*q);cv.height=Math.round(hero.clientHeight*q);
  P=Array.from({length:innerWidth<760?16:28},()=>spawn(true));}
size();addEventListener('resize',size);
function sparks(dt){cx.clearRect(0,0,sp.width,sp.height);
  for(const p of P){p.life+=dt;p.y+=p.vy*dt*60;p.x+=Math.sin(p.ph+p.life*.8)*.25*devicePixelRatio;
    const k=p.life/p.max,a=Math.sin(Math.min(k,1)*Math.PI)*(.55+.35*Math.sin(p.life*9+p.ph));
    cx.fillStyle=`rgba(${p.c},${(a*.25).toFixed(3)})`;cx.beginPath();cx.arc(p.x,p.y,p.s*4,0,6.29);cx.fill();
    cx.fillStyle=`rgba(${p.c},${a.toFixed(3)})`;cx.beginPath();cx.arc(p.x,p.y,p.s,0,6.29);cx.fill();
    if(k>=1||p.y<-10)Object.assign(p,spawn(false));}}
let vis=true,last=performance.now();
new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe($('#inicio'));
function loop(now){const dt=Math.min((now-last)/1000,.05);last=now;if(vis){draw(now/1000);sparks(dt)}requestAnimationFrame(loop)}
if(reduce){draw(12);sparks(0)}else requestAnimationFrame(loop);

