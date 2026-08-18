(()=>{'use strict';
const opening=document.getElementById('opening'),site=document.getElementById('site'),seal=document.getElementById('seal'),pages=document.getElementById('pages');
const music=document.getElementById('music'),musicBtn=document.getElementById('musicBtn');
let opened=false;
function playMusic(){
  if(!music)return;
  music.volume=.78;
  music.load();
  const p=music.play();
  if(p&&p.then)p.then(()=>musicBtn?.classList.add('playing')).catch(()=>musicBtn?.classList.remove('playing'));
}
function pauseMusic(){if(!music)return;music.pause();musicBtn?.classList.remove('playing')}
seal.addEventListener('click',()=>{
  if(opened)return;
  opened=true;
  document.querySelector('.opening-card')?.classList.add('seal-breaking');
  playMusic();
  setTimeout(()=>{
    opening.classList.add('hide');
    site.classList.add('show');
    site.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>requestAnimationFrame(sizeCanvas));
  },900);
});
musicBtn?.addEventListener('click',()=>music.paused?playMusic():pauseMusic());
music?.addEventListener('ended',()=>musicBtn?.classList.remove('playing'));
music?.addEventListener('error',()=>musicBtn?.classList.remove('playing'));

const target=new Date(2026,7,28,18,30,0).getTime();
function tick(){let x=Math.max(0,target-Date.now()),d=Math.floor(x/864e5);x%=864e5;const h=Math.floor(x/36e5);x%=36e5;const m=Math.floor(x/6e4),s=Math.floor(x/1e3)%60;[['d',d],['h',h],['m',m],['s',s]].forEach(([id,v])=>document.getElementById(id).textContent=String(v).padStart(2,'0'))}tick();setInterval(tick,1000);

const canvas=document.getElementById('wipe'),ctx=canvas.getContext('2d'),mist=document.getElementById('mist'),glass=document.querySelector('.mist-glass');
let drawing=false,last=null,cleared=false;
function sizeCanvas(){
  if(cleared||!canvas)return;
  const r=canvas.getBoundingClientRect();
  if(r.width<2||r.height<2)return;
  const scale=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(r.width*scale);
  canvas.height=Math.round(r.height*scale);
  ctx.setTransform(scale,0,0,scale,0,0);
  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle='rgba(255,249,251,.9)';
  ctx.fillRect(0,0,r.width,r.height);
  ctx.globalCompositeOperation='destination-out';
}
function position(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function wipe(e){
  if(!drawing||cleared)return;
  const p=position(e);
  ctx.lineWidth=Math.max(72,canvas.getBoundingClientRect().width*.19);
  ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();
  if(last){ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y)}else{ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.1,p.y+.1)}
  ctx.stroke();last=p;
  e.preventDefault();
  checkWipe();
}
function checkWipe(){
  const sample=document.createElement('canvas');sample.width=48;sample.height=32;
  const sampleCtx=sample.getContext('2d');sampleCtx.drawImage(canvas,0,0,48,32);
  const pixels=sampleCtx.getImageData(0,0,48,32).data;let transparent=0;
  for(let n=3;n<pixels.length;n+=4)if(pixels[n]<35)transparent++;
  if(transparent/(48*32)>.20){
    cleared=true;
    mist.classList.add('revealed');
    document.querySelector('.wipe-guide')?.classList.add('gone');
    canvas.style.pointerEvents='none';
    setTimeout(()=>canvas.remove(),550);
  }
}
canvas.addEventListener('pointerdown',e=>{
  if(cleared)return;
  if(canvas.width<10)sizeCanvas();
  drawing=true;last=null;
  try{canvas.setPointerCapture(e.pointerId)}catch(_){ }
  wipe(e);
});
canvas.addEventListener('pointermove',wipe);
canvas.addEventListener('pointerup',e=>{drawing=false;last=null;try{canvas.releasePointerCapture(e.pointerId)}catch(_){}});
canvas.addEventListener('pointercancel',()=>{drawing=false;last=null});
if(window.ResizeObserver&&glass)new ResizeObserver(()=>{if(!drawing&&!cleared)sizeCanvas()}).observe(glass);else window.addEventListener('resize',sizeCanvas);

const dots=[...document.querySelectorAll('.side-nav b')],sections=[...document.querySelectorAll('.page')];
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const index=sections.indexOf(entry.target);dots.forEach((dot,i)=>dot.classList.toggle('active',i===index))}}),{root:pages,threshold:.6});
sections.forEach(section=>observer.observe(section));
dots.forEach((dot,index)=>dot.onclick=()=>sections[index].scrollIntoView({behavior:'smooth'}));
})();