
(function(){
"use strict";
var REDUCE=matchMedia("(prefers-reduced-motion: reduce)").matches;
var FINE=matchMedia("(hover:hover) and (pointer:fine)").matches;
var GROUND="#FFFFFF", INK="#29262D", TAU=Math.PI*2;
function hex(h){h=h.replace("#","");return [0,2,4].map(function(i){return parseInt(h.slice(i,i+2),16);});}
function mix(a,b,t){var A=hex(a),B=hex(b);return "rgb("+A.map(function(v,i){return Math.round(v+(B[i]-v)*t);}).join(",")+")";}
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

/* ---------- tree-ring portraits: one per person, seeded by name, tinted by team ---------- */
var RINGS=[];
var io=new IntersectionObserver(function(es){es.forEach(function(e){var g=e.target._ring;if(g){g.vis=e.isIntersecting;g.dirty=true;}});});
function build(g,seed,c,ini){
  var r=rng(seed*9301+49297),n=8+Math.floor(r()*6),w=[],acc=0,cum=0,i;
  for(i=0;i<n;i++){var x=.55+r();w.push(x);acc+=x;}
  g.rings=w.map(function(x){cum+=x;return {f:.1+.86*cum/acc,h:[1,2,3,5].map(function(k){return {k:k,a:(.006+r()*.02)/Math.sqrt(k),p:r()*TAU,s:(r()-.5)*.7};})};});
  g.ox=(r()-.5)*.22; g.oy=(r()-.5)*.22;
  g.cracks=[];for(i=0,n=1+Math.floor(r()*3);i<n;i++)g.cracks.push({a:r()*TAU,l:.3+r()*.45});
  g.ini=ini; g.light=mix(c,GROUND,.62); g.mid=mix(c,GROUND,.22); g.dark=mix(c,INK,.42); g.bark=mix(c,INK,.66); g.dirty=true;
}
function ring(cv){
  if(cv._ring)return cv._ring;
  var g={cv:cv,ctx:cv.getContext("2d"),hov:0,hovT:0,px:.5,py:.5,tpx:.5,tpy:.5,vis:false,w:0,dirty:true};
  var host=cv.closest("[data-c]");
  build(g,+cv.dataset.seed||1,cv.dataset.c||(host&&host.dataset.c)||"#DDD9E2",cv.dataset.ini||"");
  cv._ring=g; RINGS.push(g); io.observe(cv); return g;
}
function fit(g){var d=Math.min(2,devicePixelRatio||1),w=Math.round(g.cv.clientWidth*d);if(!w)return false;if(g.cv.width!==w){g.cv.width=g.cv.height=w;g.dirty=true;}g.w=w;return true;}
function draw(g,t){
  var ctx=g.ctx,w=g.w,R=w*.48,cx=w/2,cy=w/2,amp=.75+g.hov*1.9,i,j,k;
  var sx=(g.px-.5)*.3*g.hov*R, sy=(g.py-.5)*.3*g.hov*R, pX=cx+g.ox*R+sx, pY=cy+g.oy*R+sy;
  ctx.clearRect(0,0,w,w);
  ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fillStyle=g.bark;ctx.fill();
  ctx.beginPath();ctx.arc(cx,cy,R*.95,0,TAU);ctx.fillStyle=g.mid;ctx.fill();
  ctx.lineWidth=Math.max(1,w/240);ctx.strokeStyle=g.dark;
  for(i=g.rings.length-1;i>=0;i--){
    var rg=g.rings[i],bx=cx+(pX-cx)*(1-rg.f),by=cy+(pY-cy)*(1-rg.f);
    ctx.beginPath();
    for(j=0;j<=90;j++){var a=j/90*TAU,m=1;for(k=0;k<rg.h.length;k++){var h=rg.h[k];m+=h.a*amp*Math.sin(h.k*a+h.p+t*h.s);}
      var rr=rg.f*R*.92*m,x=bx+Math.cos(a)*rr,y=by+Math.sin(a)*rr;if(j)ctx.lineTo(x,y);else ctx.moveTo(x,y);}
    ctx.closePath();ctx.fillStyle=i%2?g.light:g.mid;ctx.fill();ctx.globalAlpha=.5;ctx.stroke();ctx.globalAlpha=1;
  }
  ctx.strokeStyle=g.bark;ctx.lineWidth=Math.max(1,w/170);ctx.globalAlpha=.55;
  g.cracks.forEach(function(c){ctx.beginPath();ctx.moveTo(cx+Math.cos(c.a)*R*.96,cy+Math.sin(c.a)*R*.96);
    ctx.lineTo(cx+Math.cos(c.a+.05)*R*(.96-c.l*.5),cy+Math.sin(c.a+.05)*R*(.96-c.l*.5));ctx.lineTo(cx+Math.cos(c.a)*R*(.96-c.l),cy+Math.sin(c.a)*R*(.96-c.l));ctx.stroke();});
  ctx.globalAlpha=1;
  if(g.ini){var ir=R*.31;ctx.beginPath();ctx.arc(pX,pY,ir,0,TAU);ctx.fillStyle="rgba(251,247,238,.92)";ctx.fill();
    ctx.fillStyle=INK;ctx.font="italic "+Math.round(R*.36)+"px 'Fraunces',Georgia,serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(g.ini,pX,pY+R*.025);}
}
function loop(ts){
  var t=ts/1000;
  for(var i=0;i<RINGS.length;i++){var g=RINGS[i];if(!g.vis||!fit(g))continue;
    g.hov+=(g.hovT-g.hov)*.08;g.px+=(g.tpx-g.px)*.14;g.py+=(g.tpy-g.py)*.14;
    if(!REDUCE||g.dirty){draw(g,REDUCE?0:t);g.dirty=false;}}
  requestAnimationFrame(loop);
}
document.querySelectorAll("canvas.ring").forEach(ring);
requestAnimationFrame(loop);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){RINGS.forEach(function(g){g.dirty=true;});});
function aim(g,el,e){var r=el.getBoundingClientRect();g.hovT=1;g.tpx=(e.clientX-r.left)/r.width;g.tpy=(e.clientY-r.top)/r.height;}

/* ---------- roster: open / close, one at a time ---------- */
var roster=document.getElementById("roster"); if(!roster)return;
var rows=[].slice.call(roster.querySelectorAll(".pr"));
var hideFloat=function(){};
function setOpen(el,on){el.classList.toggle("open",on);el.querySelector(".pr-top").setAttribute("aria-expanded",String(on));}
function openOnly(el){rows.forEach(function(o){if(o!==el)setOpen(o,false);});setOpen(el,true);}
roster.addEventListener("click",function(e){var b=e.target.closest(".pr-top");if(!b)return;var el=b.parentElement,on=!el.classList.contains("open");
  if(on){openOnly(el);history.replaceState(null,"","#"+el.id);}else{setOpen(el,false);history.replaceState(null,"",location.pathname);} hideFloat();});
addEventListener("keydown",function(e){if(e.key==="Escape")rows.forEach(function(o){setOpen(o,false);});});
rows.forEach(function(el){
  var th=el.querySelector(".pr-thumb"),pt=el.querySelector(".pr-port");
  el.addEventListener("pointerenter",function(){if(th&&th._ring)th._ring.hovT=1;});
  el.addEventListener("pointerleave",function(){if(th&&th._ring)th._ring.hovT=0;if(pt&&pt._ring)pt._ring.hovT=0;});
  if(pt&&pt._ring)pt.addEventListener("pointermove",function(e){aim(pt._ring,pt,e);});
});
/* entrance: rows rise in, staggered per batch, the first time they scroll into view */
if(!REDUCE){var batch=0,bt=0,rio=new IntersectionObserver(function(es){var now=performance.now();if(now-bt>250){batch=0;}bt=now;
  es.forEach(function(e){if(!e.isIntersecting)return;e.target.style.setProperty("--k",batch++);e.target.classList.add("in");rio.unobserve(e.target);});},{rootMargin:"0px 0px -8% 0px"});
  rows.forEach(function(r){rio.observe(r);});}
/* deep link: people.html#p-name opens that person */
function fromHash(){var el=location.hash&&document.getElementById(location.hash.slice(1));if(el&&el.classList.contains("pr")){openOnly(el);setTimeout(function(){el.scrollIntoView({behavior:REDUCE?"auto":"smooth",block:"start"});},60);}}
fromHash();

/* ---------- hero: avatar strip jumps to the person; numbers count up ---------- */
document.querySelectorAll(".strip button").forEach(function(b){
  var cv=b.querySelector("canvas");
  b.addEventListener("pointermove",function(e){if(cv._ring)aim(cv._ring,b,e);});
  b.addEventListener("pointerleave",function(){if(cv._ring)cv._ring.hovT=0;});
  b.addEventListener("click",function(){var el=document.getElementById(b.dataset.to);if(!el)return;resetFilter();openOnly(el);history.replaceState(null,"","#"+el.id);
    el.scrollIntoView({behavior:REDUCE?"auto":"smooth",block:"start"});});
});
if(!REDUCE){var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);
  var el=e.target,n=+el.dataset.count,t0=performance.now();(function step(ts){var p=Math.min(1,(ts-t0)/1100),v=1-Math.pow(1-p,3);el.textContent=Math.round(n*v);if(p<1)requestAnimationFrame(step);})(t0);});});
  document.querySelectorAll("[data-count]").forEach(function(el){el.textContent="0";cio.observe(el);});}

/* ---------- team filters (primary or secondary team) with a staggered re-entry ---------- */
var fbar=document.getElementById("fbar");
function applyFilter(f){
  fbar.querySelectorAll(".fbtn").forEach(function(x){x.setAttribute("aria-pressed",String(x.dataset.g===f));});
  var k=0;rows.forEach(function(el){var show=f==="all"||(" "+el.dataset.gs+" ").indexOf(" "+f+" ")>=0;
    el.classList.remove("in");el.classList.toggle("hide",!show);
    if(!show)setOpen(el,false);else if(!REDUCE){void el.offsetWidth;el.style.setProperty("--k",k++);el.classList.add("in");}});
  document.querySelectorAll(".pr-grp").forEach(function(h){var n=h.nextElementSibling,any=false;
    while(n&&!n.classList.contains("pr-grp")){if(!n.classList.contains("hide"))any=true;n=n.nextElementSibling;}h.classList.toggle("hide",!any);});
}
function resetFilter(){if(fbar.querySelector('.fbtn[aria-pressed="true"]').dataset.g!=="all")applyFilter("all");}
fbar.addEventListener("click",function(e){var b=e.target.closest(".fbtn");if(b)applyFilter(b.dataset.g);});

/* ---------- floating portrait: follows the cursor with lag, leans into the motion ---------- */
var fl=document.getElementById("floater"),fcv=fl&&fl.querySelector("canvas"),fim=fl&&fl.querySelector("img"),cap=fl&&fl.querySelector("span");
if(!fl||REDUCE||!FINE){if(fl)fl.remove();return;}
var fg=ring(fcv),tx=0,ty=0,x=innerWidth/2,y=innerHeight/2,rot=0,sc=.4,active=false,who=null,running=false;
hideFloat=function(){active=false;fl.classList.remove("on");fg.hovT=0;};
roster.addEventListener("pointermove",function(e){var el=e.target.closest(".pr");
  if(!el||el.classList.contains("open")||e.target.closest(".pr-body")){hideFloat();return;}
  tx=e.clientX;ty=e.clientY;
  if(el!==who){who=el;var ph=el.dataset.photo;fim.hidden=!ph;fcv.hidden=!!ph;if(ph){fim.src=ph;fl.style.setProperty("--fc",el.dataset.c);}else build(fg,+el.dataset.seed,el.dataset.c,el.dataset.ini);cap.textContent=el.dataset.team;}
  aim(fg,el,e);
  if(!active){active=true;fl.classList.add("on");if(!running){running=true;x=tx+40;y=ty-120;requestAnimationFrame(follow);}}});
roster.addEventListener("pointerleave",function(){hideFloat();who=null;});
addEventListener("scroll",function(){if(active)hideFloat();},{passive:true});
function follow(){var px=x;x+=(tx+48-x)*.14;y+=(ty-fl.offsetHeight*.62-y)*.14;
  rot+=(Math.max(-14,Math.min(14,(x-px)*.6))-rot)*.15;sc+=((active?1:.4)-sc)*.16;
  fl.style.transform="translate3d("+x.toFixed(1)+"px,"+y.toFixed(1)+"px,0) rotate("+rot.toFixed(2)+"deg) scale("+sc.toFixed(3)+")";
  if(active||sc>.42)requestAnimationFrame(follow);else running=false;}
})();
