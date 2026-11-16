
/* mobile menu */
(function(){const b=document.querySelector(".menu"),n=document.getElementById("nav");if(!b||!n)return;
  b.addEventListener("click",()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",String(o));});})();
/* publications: search + type filter */
(function(){const q=document.getElementById("pq"),k=document.getElementById("pk"),list=document.getElementById("plist");if(!q||!list)return;
  const c=document.getElementById("pc");
  function run(){const t=q.value.trim().toLowerCase(),kind=k.value;let n=0;
    list.querySelectorAll(".pub").forEach(li=>{const ok=(!kind||li.dataset.k===kind)&&(!t||li.dataset.s.includes(t));li.hidden=!ok;if(ok)n++;});
    list.querySelectorAll(".yr").forEach(y=>{y.hidden=!y.querySelector(".pub:not([hidden])");});
    c.textContent=(t||kind)?n+" shown":"";}
  q.addEventListener("input",run);k.addEventListener("change",run);})();

/* nav: "Log in" becomes "Portal" once signed in (test sign-in, see portal.js) */
(function(){ let s=null; try{ s=sessionStorage.getItem("xrlab-session"); }catch(e){} if(!s){ try{ s=/xrlab-session=/.test(window.name||"")?"1":null; }catch(e){} }
  if(s) document.querySelectorAll("a.navlog").forEach(a=>{ a.querySelector("span").textContent="Portal"; a.href=a.dataset.portal||"portal.html"; }); })();
