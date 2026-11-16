
/* ---------- particle hero: brain → VR headset → Fallingwater ---------- */
(function(){
  const px=document.getElementById("px"); if(!px) return;
  const REDUCE=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sec=px.closest("section"), spot=document.getElementById("pxspot"), cv=document.getElementById("pxgl"), cap=px.querySelector(".px-cap"), bar=px.querySelector(".px-bar i"), chips=[...document.querySelectorAll(".px-chip")];
  const ST=px.dataset.stages.split("|").map(s=>s.split("~"));
  const mode=document.getElementById("pxmode"); let dayT=1;
  function setNight(on){ dayT=on?0:1; sec.classList.toggle("night",on); mode.setAttribute("aria-pressed",String(on)); mode.setAttribute("aria-label",on?"Switch to day mode":"Switch to night mode");
    try{ localStorage.setItem("xrlab-hero-night",on?"1":"0"); }catch(e){} }
  mode.addEventListener("click",e=>{ e.stopPropagation(); setNight(!sec.classList.contains("night")); });
  try{ if(localStorage.getItem("xrlab-hero-night")==="1") setNight(true); }catch(e){}
  const T=window.THREE; let R=null;
  if(T){ try{ R=new T.WebGLRenderer({canvas:cv,antialias:false,alpha:true,powerPreference:"high-performance"}); }catch(e){ R=null; } }
  if(!R){ px.classList.add("nogl"); cv.remove(); return; }
  function rng(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
  const small=innerWidth<700, N=small?11000:30000;
  const rnd=rng(17), G=()=>{ let u=0,v=0; while(!u) u=rnd(); while(!v) v=rnd(); return Math.sqrt(-2*Math.log(u))*Math.cos(6.283*v); };
  const dir=()=>{ const x=G(),y=G(),z=G(),l=Math.hypot(x,y,z)||1; return [x/l,y/l,z/l]; };
  const col=h=>[0,2,4].map(i=>parseInt(h.slice(i+1,i+3),16)/255);
  const CREAM=col("#DDD9E2"), SAF=col("#FFFFFF"), LEAFc=col("#3F8F3A"), SKYc=col("#8CC6E8"), TERc=col("#D0673F"), WALc=col("#7B4526");
  const mixc=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
  /* shape 1: brain: folded cortex with saffron crests, cerebellum, stem */
  function cortex(){ const h=rnd()<.5?-1:1, u=dir(); let x=u[0]*.40, y=u[1]*.66, z=u[2]*1.0;
    if(x*h<0) x*=.25; x+=h*.44; if(y<-.2) y=-.2+(y+.2)*.45; if(z>.2) y-=(z-.2)*.12;
    const g=Math.sin(x*13+Math.sin(z*8.5)*1.9+Math.sin(y*10)*1.3)*Math.sin(z*11.5+Math.sin(y*7.5+x*5)*1.7);
    const k=1+.075*(Math.abs(g)-.45); x=h*.44+(x-h*.44)*k; y*=k; z*=k;
    const crest=Math.max(0,Math.abs(g)-.5)/.5; return [[x,y+.12,z],mixc(CREAM,SAF,crest*.9),crest]; }
  function brain(){ const r=rnd();
    if(r<.80){ for(let tr=0;tr<8;tr++){ const out=cortex(); if(rnd()<.18+.82*out[2]||tr===7) return [out[0],out[1]]; } }
    if(r<.90){ const u=dir(); let x=u[0]*.55, y=u[1]*.24, z=u[2]*.32; y+=.012*Math.sin(y*80); return [[x,y-.58,z-.72],mixc(CREAM,TERc,.35+.3*rnd())]; }
    if(r<.94){ const t=rnd(), a=rnd()*6.283; return [[Math.cos(a)*.11,-.45-t*.55,-.35-t*.18+Math.sin(a)*.1],mixc(CREAM,TERc,.5)]; }
    const u=dir(), s=Math.cbrt(rnd())*.85; return [[u[0]*.75*s,u[1]*.55*s+.1,u[2]*.95*s],mixc(CREAM,SAF,.2)]; }
  /* shape 2: VR headset: visor, lenses, strap */
  function vr(){ const r=rnd();
    if(r<.52){ const u=dir(), a=.95,b=.52,c=.34,p=4, s=1/Math.pow(Math.abs(u[0]/a)**p+Math.abs(u[1]/b)**p+Math.abs(u[2]/c)**p,1/p); return [[u[0]*s,u[1]*s,u[2]*s+.25],mixc(CREAM,SKYc,.15+.3*rnd())]; }
    if(r<.60){ const h=rnd()<.5?-1:1, a=rnd()*6.283, rr=.075+rnd()*.02; return [[h*.42+Math.cos(a)*rr,.12+Math.sin(a)*rr,.6],SAF]; }
    if(r<.70){ const h=rnd()<.5?-1:1, a=rnd()*6.283, rr=.19*Math.sqrt(rnd()); return [[h*.33+Math.cos(a)*rr,Math.sin(a)*rr,-.1],mixc(SKYc,CREAM,.4)]; }
    if(r<.92){ let a=rnd()*Math.PI, x=Math.cos(a)*.98, z=-Math.sin(a)*.95-.05; if(z>.05) z=.05; return [[x,(rnd()-.5)*.16,z-.05],mixc(CREAM,TERc,.25)]; }
    const a=rnd()*Math.PI; return [[(rnd()-.5)*.14,Math.sin(a)*.62+.05,-Math.cos(a)*.62-.35],mixc(CREAM,TERc,.25)]; }
  /* shape 3: Fallingwater (Frank Lloyd Wright, 1935 to 1939), seen from below the falls like the classic photograph:
     ochre concrete trays cantilevered over Bear Run, a tall sandstone chimney, red steel window bands, the falls and pool */
  const CTOP=[1,.95,.82], CONC=[.93,.85,.66], CSIDE=[.78,.69,.5], CUNDER=[.5,.44,.33], RED=[.66,.16,.13], GLASS=[.32,.4,.46],
        STONEc=[.55,.46,.36], WATER=[.74,.86,.93], FOAM=[1,1,1], ROCK=[.46,.42,.37], DGREEN=[.16,.36,.18];
  const jit=c=>{ const k=.9+rnd()*.2; return [c[0]*k,c[1]*k,c[2]*k]; };
  function slab(x0,x1,z0,z1,yT,th){ const y0=yT-th, r=rnd(), X=()=>x0+rnd()*(x1-x0), Z=()=>z0+rnd()*(z1-z0);
    if(r<.38) return [[X(),y0+rnd()*th,z1],CONC];
    if(r<.50) return [[x1,y0+rnd()*th,Z()],CSIDE];
    if(r<.55) return [[x0,y0+rnd()*th,Z()],CSIDE];
    if(r<.64) return [[X(),yT+(rnd()-.5)*.01,z1+(rnd()-.5)*.01],CTOP];
    if(r<.70) return [[X(),yT-.035+(rnd()-.5)*.006,z1+.004],mixc(CTOP,CONC,.5)];
    if(r<.77) return [[x1+(rnd()-.5)*.01,yT,Z()],CTOP];
    if(r<.90) return [[X(),y0,Z()],CUNDER];
    return [[X(),yT-.015,Z()],CSIDE]; }
  function stone(x0,x1,z0,z1,y0,y1){ const r=rnd(), y=y0+rnd()*(y1-y0), mortar=((y*38)%1)<.2, c=mortar?[.34,.28,.22]:jit(STONEc);
    if(r<.55) return [[x0+rnd()*(x1-x0),y,z1],c]; if(r<.9) return [[x1,y,z0+rnd()*(z1-z0)],mixc(c,[0,0,0],.18)]; return [[x0+rnd()*(x1-x0),y1,z0+rnd()*(z1-z0)],c]; }
  function band(x0,x1,y0,y1,z,step){ const r=rnd();
    if(r<.62){ const k=Math.floor(rnd()*((x1-x0)/step+1)); return [[x0+k*step+(rnd()-.5)*.006,y0+rnd()*(y1-y0),z],RED]; }
    if(r<.80){ const yy=rnd()<.5?y0:y1; return [[x0+rnd()*(x1-x0),yy+(rnd()-.5)*.006,z],RED]; }
    return [[x0+rnd()*(x1-x0),y0+rnd()*(y1-y0),z-.01],GLASS]; }
  function fall(x0,x1,yTop,len,z){ let x=x0+rnd()*(x1-x0); x+=.008*Math.sin(x*140); const t=rnd();
    return [[x,yTop-t*len,z+t*t*.06],mixc(WATER,FOAM,.35+t*.6),[yTop,len,z]]; }
  function tree(cx,cz,base,h,rad,col){ if(rnd()<.05){ const t=rnd(); return [[cx+(rnd()-.5)*.03,base+t*h*.6,cz],[.32,.24,.17]]; }
    const u=dir(), k=Math.cbrt(rnd()); return [[cx+u[0]*rad*k,base+h*.7+u[1]*rad*.8*k,cz+u[2]*rad*.6*k],mixc(col,LEAFc,rnd()*.5)]; }
  function bush(cx,cz,y,rad){ const u=dir(), k=Math.cbrt(rnd()); return [[cx+u[0]*rad*k,y+Math.abs(u[1])*rad*.6*k,cz+u[2]*rad*.5*k],mixc(DGREEN,LEAFc,rnd()*.6)]; }
  function falls(x0,x1,yTop,len,z,lanes){ const L=Math.floor(rnd()*lanes), x=x0+(L+.5)/lanes*(x1-x0)+G()*.004, t=rnd();
    return [[x,yTop-t*len,z+t*t*.06],mixc(WATER,FOAM,.45+t*.55),[yTop,len,z]]; }
  function step(i){ const y=-.25-i*.045, z=.56+i*.05; return [[.18+rnd()*.2,y,z+rnd()*.04],i%2?CSIDE:CONC]; }
  /* each part: [weight, sampler]; a part's share of the particles sets how solid it reads */
  const FW=[
    [.13,()=>slab(-.78,.78,.02,.56,-.1,.15)],          /* living-room terrace, cantilevered over the falls */
    [.035,()=>slab(-.78,.42,-.42,.02,-.1,.12)],         /* living-room floor behind */
    [.11,()=>slab(-.24,.3,-.25,.84,.24,.13)],          /* bedroom terrace, projecting further toward the falls */
    [.03,()=>slab(-.72,-.24,-.38,.08,.24,.11)],        /* west bedroom tray */
    [.045,()=>slab(-.56,-.04,-.42,-.04,.54,.11)],      /* top-floor terrace */
    [.012,()=>{ const x=-.78+rnd()*1.56; return [[x,-.255,.565],[.2,.17,.13]]; }],   /* shadow under the living-room parapet */
    [.008,()=>{ const x=-.24+rnd()*.54; return [[x,.105,.85],[.2,.17,.13]]; }],     /* shadow under the bedroom parapet */
    [.075,()=>stone(-.46,-.28,-.56,-.3,-.42,.95)],     /* sandstone chimney core */
    [.008,()=>{ const u=dir(); return [[-.37+u[0]*.12,.95+Math.abs(u[1])*.02,-.43+u[2]*.15],[.3,.25,.2]]; }], /* chimney cap */
    [.018,()=>stone(.42,.54,-.42,-.18,-.42,.1)],       /* east stone pier */
    [.01,()=>stone(-.95,-.78,-.5,-.1,-.42,.12)],       /* west stone wall */
    [.045,()=>band(-.72,.4,-.1,.1,-.04,.075)],         /* window band under the bedroom level */
    [.022,()=>band(-.5,.0,.24,.42,-.4,.07)],           /* top-floor windows */
    [.012,()=>band(-.26,-.06,.24,.54,-.3,.05)],        /* corner glass by the chimney */
    [.015,()=>step((rnd()*6)|0)],                      /* the hatch stair hanging down to the stream */
    [.03,()=>{ const u=dir(); return [[.05+u[0]*.55,-.42+Math.abs(u[1])*.16,-.05+u[2]*.3],jit(ROCK)]; }],   /* the boulder the house is anchored to */
    [.03,()=>{ const x=-1.2+rnd()*2.3, z=-.65+rnd()*.85; return [[x,-.43-Math.abs(Math.sin(x*7+z*5))*.03,z],jit(ROCK)]; }], /* rock ledge */
    [.095,()=>falls(-.82,.56,-.43,.29,.2,26)],         /* upper falls */
    [.012,()=>{ const x=-.7+rnd()*1.2; return [[x,-.72+(rnd()-.5)*.02,.28+rnd()*.1],jit(ROCK)]; }],
    [.07,()=>falls(-.62,.42,-.74,.25,.38,20)],         /* lower falls */
    [.02,()=>{ const u=dir(); return [[-.1+u[0]*.7,-.97+Math.abs(u[1])*.08,.44+u[2]*.08],FOAM]; }],        /* mist at the foot of the falls */
    [.035,()=>{ const a=rnd()*6.283, q=Math.sqrt(rnd()); return [[Math.cos(a)*q*1.15-.1,-1.0,.74+Math.sin(a)*q*.34],q<.45?FOAM:WATER]; }], /* plunge pool */
    [.012,()=>{ const u=dir(), B=[[-.95,.6,.12],[.75,.7,.1],[.2,.98,.08]][(rnd()*3)|0]; return [[B[0]+u[0]*B[2],-.98+Math.abs(u[1])*B[2]*.7,B[1]+u[2]*B[2]],jit(ROCK)]; }],
    [.02,()=>{ const x=rnd()<.5?-1.3+rnd()*.45:.6+rnd()*.55, z=-.65+rnd()*.8; return [[x,-.44,z],mixc(WATER,FOAM,rnd()*.3)]; }], /* Bear Run above the falls */
    [.13,()=>{ const Q=[[-1.4,-.7,-.4,1.35,.42],[-.95,-1.1,-.15,1.3,.42],[-.4,-1.2,.2,1.15,.4],[.2,-1.2,.15,1.2,.42],[.8,-1.1,-.1,1.3,.44],[1.35,-.75,-.4,1.3,.42],[-1.45,.2,-.6,1.0,.36],[1.4,.15,-.6,.95,.34]][(rnd()*8)|0];
      return tree(Q[0],Q[1],Q[2],Q[3],Q[4],DGREEN); }],                                                           /* the forest around it */
    [.03,()=>rnd()<.5?bush(-1.15,.6,-.98,.32):bush(1.05,.55,-.98,.3)],
    [.03,()=>{ const k=(rnd()*7)|0, z=-.46+k*.06, x=.5+rnd()*.58, d=Math.hypot(x-.86,z+.24); const xx=d<.1?.86+(x-.86)/Math.max(d,.01)*.1:x; return [[xx,.27+(rnd()-.5)*.012,z],CONC]; }], /* the trellis over the drive, bending round a tree */
    [.015,()=>tree(.86,-.24,-.42,1.05,.2,DGREEN)],                                                     /* the tree the trellis curves around */
    [.016,()=>{ const x=[-.55,-.15,.25][(rnd()*3)|0]; return stone(x-.035,x+.035,-.06,-.03,-.1,.1); }], /* stone piers between the living-room windows */
    [.03,()=>{ const left=rnd()<.5, x=left?-1.08+rnd()*.26:.56+rnd()*.3, y=-.43-rnd()*.3, c=((y*30)%1)<.35?[.36,.31,.26]:jit(ROCK); return [[x,y,.19+(left?0:.02)],c]; }], /* layered rock face beside the falls */                                             /* rhododendron at the water */
  ];
  const FWT=FW.reduce((a,w)=>a+w[0],0);
  function pav(){ let r=rnd()*FWT; for(const [w,f] of FW){ if((r-=w)<0){ const o=f(); o[0]=[o[0][0]*1.08,o[0][1]*1.08+.03,o[0][2]*1.08]; if(o[2]) o[2]=[o[2][0]*1.08+.03,o[2][1]*1.08,o[2][2]*1.08]; return o; } } return FW[0][1](); }
  const pA=new Float32Array(N*3), pB=new Float32Array(N*3), pC=new Float32Array(N*3), cA=new Float32Array(N*3), cB=new Float32Array(N*3), cC=new Float32Array(N*3), rr=new Float32Array(N*4), fw=new Float32Array(N*3);
  for(let i=0;i<N;i++){ const a=brain(), b=vr(), c=pav(); pA.set(a[0],i*3); cA.set(a[1],i*3); pB.set(b[0],i*3); cB.set(b[1],i*3); pC.set(c[0],i*3); cC.set(c[1],i*3); if(c[2]) fw.set(c[2],i*3); rr.set([rnd(),rnd(),rnd(),rnd()],i*4); }
  const geo=new T.BufferGeometry();
  geo.setAttribute("position",new T.BufferAttribute(pA,3)); geo.setAttribute("pB",new T.BufferAttribute(pB,3)); geo.setAttribute("pC",new T.BufferAttribute(pC,3));
  geo.setAttribute("cA",new T.BufferAttribute(cA,3)); geo.setAttribute("cB",new T.BufferAttribute(cB,3)); geo.setAttribute("cC",new T.BufferAttribute(cC,3)); geo.setAttribute("rr",new T.BufferAttribute(rr,4)); geo.setAttribute("fw",new T.BufferAttribute(fw,3));
  const U={uDay:{value:dayT},uFrom:{value:0},uTo:{value:0},uK:{value:1},uT:{value:0},uPix:{value:1},uSize:{value:small?23:19},uHov:{value:0},uAsp:{value:1},uMouse:{value:new T.Vector2(9,9)},uIntro:{value:REDUCE?1:0},uBurst:{value:0},uBurstAt:{value:new T.Vector2(0,0)},uHold:{value:0},uVel:{value:0},uScroll:{value:0},uSc:{value:1},uCamZ:{value:5}};
  const mat=new T.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:dayT?T.NormalBlending:T.AdditiveBlending,
    vertexShader:`attribute vec3 pB,pC,cA,cB,cC,fw; attribute vec4 rr; uniform float uFrom,uTo,uK,uT,uPix,uSize,uHov,uAsp,uIntro,uBurst,uHold,uVel,uScroll,uSc; uniform vec2 uMouse,uBurstAt; uniform float uCamZ,uDay; varying vec3 vC; varying float vA; varying float vP; varying float vZ; varying float vF;
      vec3 sp(float i){ vec3 q=pC; if(fw.y>0.){ float ph=fract(sin(dot(rr,vec4(12.99,78.23,37.72,4.58)))*43758.55); float t=fract(uT*(.34+rr.z*.16)+ph); q=vec3(pC.x,fw.x-t*fw.y,fw.z+t*t*.06); } return i<.5?position:(i<1.5?pB:q); }
      vec3 sc(float i){ return i<.5?cA:(i<1.5?cB:cC); }
      void main(){ float s=rr.x*.35; float k=smoothstep(s,s+.65,uK);
        vec3 p=mix(sp(uFrom),sp(uTo),k); vec3 c=mix(sc(uFrom),sc(uTo),k);
        p+=(rr.yzw-.5)*sin(3.14159*k)*1.1*step(.5,abs(uTo-uFrom));
        p+=.014*vec3(sin(uT*.7+rr.x*40.),cos(uT*.9+rr.y*40.),sin(uT*.8+rr.z*40.));
        float lag=-uVel*(.15+rr.x*.9), cs=cos(lag), sn=sin(lag); p.xz=mat2(cs,-sn,sn,cs)*p.xz;          /* jelly wobble when spun fast */
        p+=(rr.yzw-.5)*uScroll*2.6;                                                                    /* drifts apart as you scroll away */
        float wb=(uTo<.5?k:0.)+(uFrom<.5?1.-k:0.); vP=(uTo>1.5?k:0.)+(uFrom>1.5?1.-k:0.);
        float fire=wb*pow(max(0.,sin(dot(position,vec3(4.,6.,2.5))*1.6-uT*2.2)),30.)+wb*smoothstep(.985,1.,fract(uT*.27+rr.y*13.));  /* neurons firing */
        float ii=smoothstep(rr.w*.6,rr.w*.6+.4,uIntro); p=mix((rr.yzw-.5)*9.,p,ii);
        vec4 mv=modelViewMatrix*vec4(p,1.); vec4 cl=projectionMatrix*mv; vec2 nd=cl.xy/cl.w; float Z=-mv.z, th=.3057;
        vec2 d=(nd-uMouse)*vec2(uAsp,1.)/uSc; float L=length(d); vec2 dn=d/(L+1e-5), tg=vec2(-dn.y,dn.x);
        float f=uHov*(1.-uHold)*smoothstep(.42,0.,L);
        mv.xy+=(dn*.16+tg*.32*(rr.x-.25))*f;                                                           /* swirl round the cursor */
        float g=uHold*smoothstep(1.6,0.,L);
        mv.xy-=vec2((nd.x-uMouse.x)*uAsp,(nd.y-uMouse.y))*th*Z*g*(.75+rr.y*.2); mv.xy+=tg*g*.12*sin(uT*3.+rr.x*30.); /* hold: pulled into the cursor */
        vec2 e=(nd-uBurstAt)*vec2(uAsp,1.)/uSc; float le=length(e);
        mv.xy+=(e/(le+1e-5))*uBurst*(.25+rr.y*1.1)*smoothstep(2.2,0.,le); mv.z+=(rr.z-.5)*uBurst*1.4;  /* click: burst */
        gl_Position=projectionMatrix*mv; gl_PointSize=uSize*uPix*(.55+rr.w*.9)*(1.-uDay*.18)*(1.+f*1.2+g*.6+fire*1.6)/(-mv.z);
        vC=c*(1.+f*.5); vF=fire; vZ=clamp((-mv.z-uCamZ)/2.4+.5,0.,1.); vA=min(1.,(.45+.55*rr.x)*ii*(1.+fire)); }`,
    fragmentShader:`uniform float uDay; varying vec3 vC; varying float vA; varying float vP; varying float vZ; varying float vF; void main(){ vec2 q=gl_PointCoord-.5; float r=length(q);
      /* night: soft additive glow */
      float aN=smoothstep(.5,0.,r); aN*=aN; vec3 night=vC+vF*vec3(.9,.85,1.);
      /* day: crisp ink dots, shaded by depth so the shape reads as a solid in 3D (near = deep aubergine, far = pale mauve) */
      float aD=smoothstep(.5,.28,r);
      vec3 nat=min(vC,vec3(1.)); float lum=dot(nat,vec3(.3,.59,.11));
      vec3 ink=mix(vec3(.24,.10,.36),vec3(.62,.52,.66),clamp(vZ*.85+(1.-lum)*.12,0.,1.));
      ink=mix(ink,vec3(.55,.42,.70),smoothstep(.93,1.,lum)*.65);                 /* bright crests and lenses pick up sage */
      vec3 real=nat*mix(.66,.95,vZ);                                             /* Fallingwater keeps its real colours */
      vec3 day=mix(mix(ink,real,vP),vec3(.52,.32,.74),min(1.,vF)*.6);                    /* neurons firing flash olive green */
      float swap=1.-.9*(1.-abs(uDay*2.-1.));
      float a=mix(aN*vA*1.55, aD*vA*mix(1.05,.42,vZ)*(1.+vF*.6), uDay);
      gl_FragColor=vec4(mix(night,day,uDay),a*swap); }`});
  U.uDay.value=dayT;
  const scene=new T.Scene(), cam=new T.PerspectiveCamera(34,1,.1,50), pts=new T.Points(geo,mat), grp=new T.Group(); grp.add(pts); scene.add(grp);
  let OX=0,OY=0;
  function size(){ const w=cv.clientWidth, h=cv.clientHeight; if(!w||!h) return; R.setPixelRatio(Math.min(devicePixelRatio||1,1.75)); R.setSize(w,h,false); cam.aspect=w/h;
    const cr=cv.getBoundingClientRect(), sr=spot.getBoundingClientRect(), S=Math.max(120,Math.min(sr.width,sr.height)), sx=sr.left+sr.width/2-cr.left, sy=sr.top+sr.height/2-cr.top;
    const wpp=2.9/S, D=wpp*h/(2*Math.tan(17*Math.PI/180)); cam.position.set(0,0,D); cam.updateProjectionMatrix();
    OX=(sx-w/2)*wpp; OY=-(sy-h/2)*wpp; U.uPix.value=R.getPixelRatio()*.622*(S/560)*D/4.5; U.uAsp.value=w/h; U.uSc.value=S/h; U.uCamZ.value=D; sec.style.setProperty("--gx",sx+"px"); sec.style.setProperty("--gy",sy+"px"); sec.style.setProperty("--gr",(S*.62)+"px"); }
  addEventListener("resize",size); size();
  /* stages: auto-advance, click to advance, chips to jump */
  let cur=0, since=performance.now(), hold=0; const DWELL=6500;
  function go(n,user){ n=(n+3)%3; if(n===cur&&user) return; U.uFrom.value=U.uK.value<1?U.uTo.value:cur; U.uTo.value=n; U.uK.value=0; cur=n; since=performance.now(); if(user) hold=performance.now()+9000;
    chips.forEach(c=>c.setAttribute("aria-pressed",String(+c.dataset.s===n)));
    cap.classList.add("sw"); setTimeout(()=>{ cap.querySelector(".px-t").textContent=ST[n][0]; cap.querySelector(".px-d").textContent=ST[n][1]; cap.classList.remove("sw"); },260); }
  chips.forEach(c=>c.addEventListener("click",()=>go(+c.dataset.s,true)));
  /* pointer: hover pushes particles, drag turns, click advances with a pop */
  let mx=0,my=0,tx=0,ty=0,hovT=0,vis=true,drag=null,yawU=0,yawV=0,moved=0,raf=0;
  sec.addEventListener("pointermove",e=>{ const r=cv.getBoundingClientRect(); tx=(e.clientX-r.left)/r.width*2-1; ty=-((e.clientY-r.top)/r.height*2-1); hovT=e.pointerType==="mouse"?1:0;
    if(drag!==null){ const dx=e.clientX-drag; drag=e.clientX; moved+=Math.abs(dx); yawV=dx*.006; yawU+=yawV; } });
  sec.addEventListener("pointerleave",()=>{ hovT=0; });
  let holding=false, holdTimer=0;
  const burst=(x,y,k)=>{ U.uBurstAt.value.set(x,y); U.uBurst.value=k; };
  spot.addEventListener("pointerdown",e=>{ drag=e.clientX; moved=0; const r=cv.getBoundingClientRect(); tx=(e.clientX-r.left)/r.width*2-1; ty=-((e.clientY-r.top)/r.height*2-1);
    clearTimeout(holdTimer); holdTimer=setTimeout(()=>{ if(drag!==null&&moved<6){ holding=true; spot.classList.add("pull"); hold=performance.now()+9000; } },200); });
  addEventListener("pointerup",e=>{ if(drag===null) return; drag=null; clearTimeout(holdTimer);
    if(holding){ holding=false; spot.classList.remove("pull"); burst(mx,my,1.1); hold=performance.now()+6000; return; }
    if(moved<6&&spot.contains(e.target)){ burst(tx,ty,1); go(cur+1,true); } });
  new IntersectionObserver(es=>{ vis=es[0].isIntersecting; if(vis&&!raf) raf=requestAnimationFrame(frame); }).observe(sec);
  if(window.ResizeObserver) new ResizeObserver(size).observe(sec);
  const t0=performance.now();
  function frame(t){ raf=0; if(!vis) return; const s=(t-t0)/1000;
    if(!REDUCE){ U.uIntro.value=Math.min(1,s/2.4); if(t>hold&&t-since>DWELL&&U.uIntro.value>=1) go(cur+1,false); }
    U.uK.value=Math.min(1,U.uK.value+(REDUCE?1:.0105)); U.uBurst.value*=.9; U.uHold.value+=((holding?1:0)-U.uHold.value)*.09;
    U.uVel.value+=(Math.max(-.9,Math.min(.9,yawV*4))-U.uVel.value)*.15;
    { const r=sec.getBoundingClientRect(), q=Math.max(0,Math.min(1,-r.top/Math.max(1,r.height))); U.uScroll.value=REDUCE?0:q*q; }
    bar.style.width=(REDUCE?0:Math.min(1,(t-since)/DWELL)*100)+"%";
    mx+=(tx-mx)*.08; my+=(ty-my)*.08; U.uMouse.value.set(mx,my); U.uHov.value+=(hovT-U.uHov.value)*.06; U.uT.value=REDUCE?0:s;
    U.uDay.value+=(dayT-U.uDay.value)*(REDUCE?1:.07); const wantNormal=U.uDay.value>.5; if((mat.blending===T.NormalBlending)!==wantNormal){ mat.blending=wantNormal?T.NormalBlending:T.AdditiveBlending; mat.needsUpdate=true; }
    if(drag===null){ yawV*=.94; yawU+=yawV; yawU*=.993; }
    const pavK=cur===2?Math.min(1,U.uK.value*1.3):(U.uFrom.value===2?1-Math.min(1,U.uK.value*1.3):0), ke=pavK*pavK*(3-2*pavK);
    const spin=REDUCE?.6:(((s*.12+Math.PI)%(2*Math.PI))-Math.PI);
    grp.position.set(OX,OY,0);grp.rotation.y=spin*(1-ke)+(-.52+.1*Math.sin(s*.35))*ke+yawU+mx*.3*(1-ke*.6); grp.rotation.x=.18*(1-ke)-.15*ke-my*.15*(1-ke*.6);
    R.render(scene,cam); raf=requestAnimationFrame(frame); }
  raf=requestAnimationFrame(frame);
})();

/* ---------- photo strip: drag to scroll, arrows ---------- */
(function(){
  const gs=document.getElementById("gs"); if(!gs) return; const tr=gs.querySelector(".gs-track"); let d=null,sx=0,moved=0;
  tr.addEventListener("pointerdown",e=>{ if(e.pointerType!=="mouse") return; d=e.clientX; sx=tr.scrollLeft; moved=0; });
  addEventListener("pointermove",e=>{ if(d===null) return; const dx=e.clientX-d; moved=Math.abs(dx); if(moved>4) tr.classList.add("drag"); tr.scrollLeft=sx-dx; });
  addEventListener("pointerup",()=>{ d=null; setTimeout(()=>tr.classList.remove("drag"),0); });
  tr.addEventListener("click",e=>{ if(moved>6){ e.stopPropagation(); e.preventDefault(); moved=0; } },true);
  gs.querySelector(".gs-prev").addEventListener("click",()=>tr.scrollBy({left:-tr.clientWidth*.8,behavior:"smooth"}));
  gs.querySelector(".gs-next").addEventListener("click",()=>tr.scrollBy({left:tr.clientWidth*.8,behavior:"smooth"}));
})();

/* ---------- gallery reveal ---------- */
(function(){
  const items=document.querySelectorAll(".gal-i"); if(!items.length) return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }),{threshold:.12});
  items.forEach(i=>io.observe(i));
})();

/* ---------- lightbox ---------- */
(function(){
  const lb=document.getElementById("lb"); if(!lb) return;
  const P=lb.dataset.photos.split("|").map(s=>s.split("~")), img=lb.querySelector("img"), n=lb.querySelector(".lb-n"), cp=lb.querySelector(".lb-cap");
  let i=0, last=null;
  function show(k,anim){ i=(k+P.length)%P.length; const set=()=>{ img.src=P[i][0]; img.alt=P[i][1]; cp.textContent=P[i][1]; n.textContent=`${String(i+1).padStart(2,"0")} / ${P.length}`; img.classList.remove("sw"); };
    if(anim){ img.classList.add("sw"); setTimeout(set,180); } else set(); }
  function open(k){ last=document.activeElement; show(k,false); lb.hidden=false; document.body.style.overflow="hidden"; lb.querySelector(".lb-x").focus(); }
  function close(){ lb.hidden=true; document.body.style.overflow=""; if(last) last.focus(); }
  document.querySelectorAll("[data-lb]").forEach(b=>b.addEventListener("click",()=>open(+b.dataset.lb)));
  lb.querySelector(".lb-x").addEventListener("click",close);
  lb.querySelector(".lb-p").addEventListener("click",()=>show(i-1,true)); lb.querySelector(".lb-nx").addEventListener("click",()=>show(i+1,true));
  lb.addEventListener("click",e=>{ if(e.target===lb||e.target.classList.contains("lb-stage")) close(); });
  addEventListener("keydown",e=>{ if(lb.hidden) return; if(e.key==="Escape") close(); if(e.key==="ArrowLeft") show(i-1,true); if(e.key==="ArrowRight") show(i+1,true); });
  let sx=null; lb.addEventListener("touchstart",e=>{ sx=e.touches[0].clientX; },{passive:true});
  lb.addEventListener("touchend",e=>{ if(sx===null) return; const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>50) show(i+(dx<0?1:-1),true); sx=null; });
})();
