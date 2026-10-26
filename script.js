'use strict';
// Configuração do contato centralizada. Número utilizado na LP de referência.
const CONTACT = { phone: '554898510053' };
document.querySelectorAll('[data-contact]').forEach(link => {
 const position = link.dataset.contact;
 const modality = position === 'online' ? ' Tenho interesse em atendimento online.' : position === 'presencial' ? ' Tenho interesse em atendimento presencial.' : '';
 link.href = `https://api.whatsapp.com/send/?phone=${CONTACT.phone}&text=${encodeURIComponent('Olá, gostaria de informações sobre as consultas com o Dr. Guido Boabaid May.' + modality)}`;
 link.addEventListener('click', () => {
  // Clique é intenção de contato, não consulta confirmada. Nenhum dado de saúde é coletado.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({event: 'clique_whatsapp', placement: position});
 });
});
document.getElementById('year').textContent = new Date().getFullYear();

// Movimento progressivo: todo o conteúdo continua acessível sem JavaScript.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.prepend(progress);
let framePending = false;
function drawProgress() {
 const range = document.documentElement.scrollHeight - innerHeight;
 progress.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
 framePending = false;
}
addEventListener('scroll', () => {
 if (!framePending) { framePending = true; requestAnimationFrame(drawProgress); }
}, {passive:true});
addEventListener('resize', drawProgress);
drawProgress();
const sound = document.querySelector('.sound');
if (sound) sound.innerHTML = '<i></i>'.repeat(9);
if (!reducedMotion.matches) {
 const title = document.querySelector('h1');
 title.querySelectorAll(':scope > span').forEach((line, i) => {
  line.animate([{opacity:0, transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}], {duration:850,delay:i*140,easing:'cubic-bezier(.22,.7,.25,1)',fill:'backwards'});
 });
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if(entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  });
 }, {threshold:.08});
 document.querySelectorAll('.section > div, .section > h2, .section > .eyebrow, .steps article, .credentials p').forEach((el,i) => {
  el.classList.add('reveal-ready');
  el.style.setProperty('--delay', `${(i%3)*60}ms`);
  observer.observe(el);
 });
 const counter = document.querySelector('.credentials p:first-child strong');
 const countObserver = new IntersectionObserver(entries => {
  if(!entries[0].isIntersecting) return;
  countObserver.disconnect();
  const start = performance.now();
  function tick(now) {
   const t = Math.min((now-start)/1100,1);
   counter.textContent = Math.round(30*(1-Math.pow(1-t,3)))+'+';
   if(t<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
 },{threshold:.5});
 countObserver.observe(counter);
}
const steps = [...document.querySelectorAll('.steps article')];
const stepObserver = new IntersectionObserver(entries => {
 const visible = entries.filter(e=>e.isIntersecting);
 if(visible.length) { steps.forEach(el=>el.classList.remove('active')); visible[0].target.classList.add('active'); }
},{rootMargin:'-20% 0px -25% 0px',threshold:.5});
steps.forEach(el=> {
 stepObserver.observe(el);
 el.addEventListener('pointerenter',()=>{steps.forEach(s=>s.classList.remove('active'));el.classList.add('active');});
});
// Boutons magnétiques discrets, uniquement sur souris et sans préférence de réduction du mouvement.
document.querySelectorAll('.button').forEach(button => {
 button.addEventListener('pointermove', event => {
  if(!finePointer.matches || reducedMotion.matches) return;
  const r=button.getBoundingClientRect();
  button.style.transform=`translate(${(event.clientX-r.left-r.width/2)*.06}px,${(event.clientY-r.top-r.height/2)*.12}px)`;
 });
 button.addEventListener('pointerleave',()=>button.style.transform='');
});
document.querySelectorAll('.faq details').forEach(detail => {
 detail.addEventListener('toggle', () => {
  if(!detail.open) return;
  document.querySelectorAll('.faq details').forEach(other => { if(other!==detail) other.open=false; });
  if(!reducedMotion.matches) detail.querySelector('p').animate([{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});
 });
});
// Luz acompanha o cursor nos cards, sem alterar o conteúdo ou a navegação.
document.querySelectorAll('.consult-grid article').forEach(card => {
 card.addEventListener('pointermove', event => {
  if (!finePointer.matches || reducedMotion.matches) return;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
  card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
 });
 card.addEventListener('pointerleave', () => {
  card.style.removeProperty('--spot-x'); card.style.removeProperty('--spot-y');
 });
});
const inviteObserver = new IntersectionObserver(entries => {
 entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  if (!reducedMotion.matches) entry.target.classList.add('is-inviting');
  inviteObserver.unobserve(entry.target);
 });
}, {threshold:.9});
document.querySelectorAll('.button').forEach(button => {
 inviteObserver.observe(button);
 button.addEventListener('animationend', event => {
  if (event.animationName === 'button-invite') button.classList.remove('is-inviting');
 });
 button.addEventListener('pointerdown', event => {
  if (reducedMotion.matches) return;
  const bounds = button.getBoundingClientRect();
  const ripple = document.createElement('i');
  ripple.className = 'ripple'; ripple.setAttribute('aria-hidden', 'true');
  const size = Math.max(bounds.width, bounds.height);
  Object.assign(ripple.style, {width:`${size}px`,height:`${size}px`,left:`${event.clientX-bounds.left}px`,top:`${event.clientY-bounds.top}px`});
  button.append(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), {once:true});
 });
});
// Indicador de leitura das etapas sincronizado com a área visível.
const methodProgress = document.createElement('div');
methodProgress.className = 'method-progress';
methodProgress.setAttribute('aria-hidden', 'true');
methodProgress.innerHTML = '<i></i>';
document.querySelector('.steps').after(methodProgress);
const syncStepProgress = () => {
 const current = steps.findIndex(step => step.classList.contains('active'));
 methodProgress.firstElementChild.style.width = `${((Math.max(0,current)+1)/steps.length)*100}%`;
};
const stepChanges = new MutationObserver(syncStepProgress);
steps.forEach(step => stepChanges.observe(step,{attributes:true,attributeFilter:['class']}));
syncStepProgress();
// Entrées différenciées, sans détourner le défilement natif.
if (!reducedMotion.matches) {
 const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (!entry.isIntersecting) return;
   const order = [...entry.target.parentElement.children].indexOf(entry.target);
   entry.target.animate([
    {opacity:0,translate:'0 22px'},
    {opacity:1,translate:'0 0'}
   ],{duration:650,delay:Math.min(order*90,270),easing:'cubic-bezier(.22,.7,.25,1)',fill:'backwards'});
   cardObserver.unobserve(entry.target);
  });
 },{threshold:.12});
 document.querySelectorAll('.situations article,.consult-grid article,.faq details').forEach(el=>cardObserver.observe(el));
}
