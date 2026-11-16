
/* map: pan, zoom, building names, walking routes */
(function(){
  const svg=document.getElementById("wmap"),frame=document.getElementById("wframe");if(!svg||!frame)return;
  const NS="http://www.w3.org/2000/svg",REDUCE=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [WX,WY,WW,WH]=svg.dataset.world.split(" ").map(Number),[HX,HY]=svg.dataset.home.split(" ").map(Number);
  const tip=document.getElementById("wtip"),stat=document.getElementById("wstat"),fx=document.getElementById("wfx");
  const Z0=()=>frame.clientWidth<640?1.7:2.3,ZMIN=.75,ZMAX=7;let cx=HX,cy=HY,z=Z0(),anim=null;
  function clamp(){const w=frame.clientWidth/z,h=frame.clientHeight/z;cx=Math.max(WX+w*.3,Math.min(WX+WW-w*.3,cx));cy=Math.max(WY+h*.3,Math.min(WY+WH-h*.3,cy));}
  function apply(){clamp();const w=frame.clientWidth/z,h=frame.clientHeight/z;svg.setAttribute("viewBox",`${(cx-w/2).toFixed(2)} ${(cy-h/2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);}
  function fly(tx,ty,tz,ms=800){cancelAnimationFrame(anim);const a=[cx,cy,z],t0=performance.now();if(REDUCE){cx=tx;cy=ty;z=tz;apply();return;}
    (function s(t){const k=Math.min(1,(t-t0)/ms),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;cx=a[0]+(tx-a[0])*e;cy=a[1]+(ty-a[1])*e;z=Math.exp(Math.log(a[2])+(Math.log(tz)-Math.log(a[2]))*e);apply();if(k<1)anim=requestAnimationFrame(s);})(t0);}
  const pt=e=>{const r=svg.getBoundingClientRect();return[cx+(e.clientX-r.left-r.width/2)/z,cy+(e.clientY-r.top-r.height/2)/z];};
  let down=null;
  svg.addEventListener("pointerdown",e=>{if(e.button)return;cancelAnimationFrame(anim);down={x:e.clientX,y:e.clientY};svg.setPointerCapture(e.pointerId);svg.classList.add("drag");});
  svg.addEventListener("pointermove",e=>{if(down){cx-=(e.clientX-down.x)/z;cy-=(e.clientY-down.y)/z;down={x:e.clientX,y:e.clientY};apply();tip.hidden=true;return;}
    const b=e.target.closest(".bld,.mk");if(b){const r=frame.getBoundingClientRect();tip.textContent=b.dataset.n;tip.style.left=(e.clientX-r.left)+"px";tip.style.top=(e.clientY-r.top)+"px";tip.hidden=false;}else tip.hidden=true;});
  ["pointerup","pointercancel"].forEach(t=>svg.addEventListener(t,()=>{down=null;svg.classList.remove("drag");}));
  svg.addEventListener("pointerleave",()=>{tip.hidden=true;});
  svg.addEventListener("wheel",e=>{if(!e.ctrlKey)return;e.preventDefault();const[px,py]=pt(e),nz=Math.max(ZMIN,Math.min(ZMAX,z*Math.exp(-e.deltaY*.012)));cx=px-(px-cx)*z/nz;cy=py-(py-cy)*z/nz;z=nz;apply();},{passive:false});
  frame.querySelectorAll(".wbtn").forEach(b=>b.addEventListener("click",()=>{if(b.hasAttribute("data-home"))fly(HX,HY,Z0());else fly(cx,cy,Math.max(ZMIN,Math.min(ZMAX,z*+b.dataset.z)),350);}));
  let walk=null;
  document.querySelectorAll(".way").forEach(btn=>btn.addEventListener("click",()=>{const r=document.getElementById("rt-"+btn.dataset.k);if(!r)return;
    document.querySelectorAll(".way").forEach(x=>x.setAttribute("aria-pressed",String(x===btn)));
    svg.querySelectorAll(".rt").forEach(p=>p.classList.remove("on","base"));svg.querySelectorAll(".rt.base").forEach(b=>b.remove());
    const base=r.cloneNode();base.removeAttribute("id");base.classList.add("base");r.before(base);r.classList.add("on");
    const L=r.getTotalLength(),bb=r.getBBox(),tz=Math.max(ZMIN,Math.min(4,Math.min(frame.clientWidth/(bb.width+90),frame.clientHeight/(bb.height+90))));
    fly(bb.x+bb.width/2,bb.y+bb.height/2,tz);if(stat)stat.textContent=`${r.dataset.from}: ${r.dataset.m} m, about ${r.dataset.min} min on foot.`;
    if(walk)walk.remove();walk=document.createElementNS(NS,"use");walk.setAttribute("href","#wf-walker");walk.setAttribute("class","me");fx.appendChild(walk);
    const dur=REDUCE?0:Math.max(2400,Math.min(6000,L*6)),t0=performance.now()+600;
    (function s(t){const k=dur?Math.max(0,Math.min(1,(t-t0)/dur)):1,p=r.getPointAtLength(L*k);walk.setAttribute("transform",`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${Math.max(1.4,6/z).toFixed(2)})`);if(k<1&&walk.isConnected)requestAnimationFrame(s);})(performance.now());
    if(innerWidth<900)frame.scrollIntoView({behavior:REDUCE?"auto":"smooth",block:"center"});}));
  addEventListener("resize",apply);apply();
})();
