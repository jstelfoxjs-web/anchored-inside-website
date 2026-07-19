
const navToggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('.nav');
navToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));

const resourceGrid=document.getElementById('resource-grid');
const search=document.getElementById('resource-search');
const audience=document.getElementById('audience-filter');
const topic=document.getElementById('topic-filter');
const count=document.getElementById('resource-count');

async function loadResources(){
  if(!resourceGrid)return;
  const response=await fetch('data/resources.json');
  const items=await response.json();
  render(items);
  [search,audience,topic].forEach(el=>el?.addEventListener('input',()=>render(items)));
}
function render(items){
  const q=(search?.value||'').toLowerCase().trim();
  const a=audience?.value||'all';
  const t=topic?.value||'all';
  const filtered=items.filter(r=>{
    const text=[r.title,r.description,r.type,...r.audience,...r.topics].join(' ').toLowerCase();
    return (!q||text.includes(q))&&(a==='all'||r.audience.includes(a))&&(t==='all'||r.topics.includes(t));
  });
  count.textContent=`${filtered.length} resource${filtered.length===1?'':'s'}`;
  resourceGrid.innerHTML=filtered.map(r=>`
    <article class="card resource-card">
      <img src="${r.file}" alt="${r.title}">
      <div class="resource-body">
        <div class="eyebrow">${r.audience.join(' · ')}</div>
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <div class="tags">${r.topics.map(x=>`<span class="tag">${x.replaceAll('-',' ')}</span>`).join('')}<span class="tag">${r.type}</span></div>
        <div class="resource-actions">
          <button class="btn btn-primary" data-view="${r.file}" data-title="${r.title}">Read online</button>
          <a class="btn btn-secondary" href="${r.file}" download>Download</a>
        </div>
      </div>
    </article>`).join('');
}
loadResources();

const modal=document.getElementById('resource-modal');
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-view]');
 if(btn&&modal){
  document.getElementById('modal-image').src=btn.dataset.view;
  document.getElementById('modal-image').alt=btn.dataset.title;
  document.getElementById('modal-title').textContent=btn.dataset.title;
  modal.classList.add('open');document.body.style.overflow='hidden';
 }
 if(e.target.matches('.modal-close')||e.target===modal)closeModal();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
function closeModal(){if(!modal)return;modal.classList.remove('open');document.body.style.overflow='';}

// Compact Anchored Inside ribbon after the hero begins to scroll.
const stickyHeader=document.querySelector('[data-sticky-header]');
function updateStickyHeader(){
  stickyHeader?.classList.toggle('is-scrolled',window.scrollY>70);
}
updateStickyHeader();
window.addEventListener('scroll',updateStickyHeader,{passive:true});

