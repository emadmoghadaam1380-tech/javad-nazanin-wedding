(()=>{'use strict';
const opening=document.getElementById('opening'),site=document.getElementById('site'),seal=document.getElementById('seal'),pages=document.getElementById('pages');
let opened=false;
const music=document.getElementById('music'),musicBtn=document.getElementById('musicBtn');
function playMusic(){if(!music)return;music.volume=.72;music.play().then(()=>{musicBtn&&musicBtn.classList.add('playing')}).catch(()=>{})}
function pauseMusic(){if(!music)return;music.pause();musicBtn&&musicBtn.classList.remove('playing')}
seal.addEventListener('click',()=>{if(opened)return;opened=true;document.querySelector('.opening-card').classList.add('seal-breaking');setTimeout(()=>{opening.classList.add('hide');site.classList.add('show');site.setAttribute('aria-hidden','false');requestAnimationFrame(()=>{size();playMusic()})},900)});
if(musicBtn)musicBtn.addEventListener('click',()=>music&&music.paused?playMusic():pauseMusic());
const target=new Date(2026,7,28,18,30,0).getTime();
function tick(){let x=Math.max(0,target-Date.now()),d=Math.floor(x/864e5);x%=864e5;let h=Math.floor(x/36e5);x%=36e5;let m=Math.floor(x/6e4),s=Math.floor(x/1e3)%60;[['d',d],['h',h],['m',m],['s',s]].forEach(([id,v])=>document.getElementById(id).textContent=String(v).padStart(2,'0'))}tick();setInterval(tick,1000);
const canvas=document.getElementById('wipe'),ctx=canvas.getContext('2d'),mist=document.getElementById('mist');let drawing=false,last=null,cleared=false;
function size(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;const d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);ctx.globalCompositeOperation='source-over';ctx.fillStyle='rgba(255,255,255,.78)';ctx.fillRect(0,0,r.width,r.height);ctx.globalCompositeOperation='destination-out'}
function pos(e){const r=canvas.getBoundingClientRect(),p=e.touches?e.touches[0]:e;return{x:p.clientX-r.left,y:p.clientY-r.top}}
function wipe(e){if(!drawing||cleared)return;const p=pos(e);ctx.lineWidth=Math.max(72,canvas.getBoundingClientRect().width*.18);ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();if(last){ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y)}else{ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+1,p.y+1)}ctx.stroke();last=p;e.preventDefault();check()}
function check(){if(cleared)return;const t=document.createElement('canvas');t.width=48;t.height=32;const c=t.getContext('2d');c.drawImage(canvas,0,0,48,32);const a=c.getImageData(0,0,48,32).data;let n=0;for(let i=3;i<a.length;i+=4)if(a[i]<35)n++;if(n/(48*32)>.22){cleared=true;mist.style.opacity='0';mist.style.pointerEvents='none';document.querySelector('.wipe-guide')?.classList.add('gone');canvas.style.pointerEvents='none';setTimeout(()=>canvas.remove(),550)}}
canvas.addEventListener('pointerdown',e=>{drawing=true;last=null;wipe(e)});canvas.addEventListener('pointermove',wipe);window.addEventListener('pointerup',()=>{drawing=false;last=null});
canvas.addEventListener('touchstart',e=>{drawing=true;last=null;wipe(e)},{passive:false});canvas.addEventListener('touchmove',wipe,{passive:false});canvas.addEventListener('touchend',()=>{drawing=false;last=null});
window.addEventListener('resize',()=>{if(opened)size()});
const dots=[...document.querySelectorAll('.side-nav b')],sections=[...document.querySelectorAll('.page')];const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=sections.indexOf(e.target);dots.forEach((d,j)=>d.classList.toggle('active',i===j))}}),{root:pages,threshold:.6});sections.forEach(s=>observer.observe(s));dots.forEach((d,i)=>d.onclick=()=>sections[i].scrollIntoView({behavior:'smooth'}));
size();
})();