const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => nav?.classList.remove('open')));

const resourceGrid = document.getElementById('resource-grid');
const search = document.getElementById('resource-search');
const topic = document.getElementById('topic-filter');
const count = document.getElementById('resource-count');
const emptyState = document.getElementById('resource-empty');
const activeFilterNote = document.getElementById('active-filter-note');
const clearFiltersButton = document.getElementById('clear-filters');
const heroSearchStatus = document.getElementById('hero-search-status');
let activeAudience = 'all';
let resources = [];
const embeddedResources = [{"title":"What to Do When Your Nervous System Is Fried","audience":["individuals","teens","parents"],"topics":["nervous-system-regulation","nervous-system","regulation","grounding","stress","burnout"],"type":"Visual handout","description":"A practical visual menu of simple sensory, movement, connection, rest, and grounding ideas for moments of overwhelm or nervous-system overload.","file":"assets/handouts/when-your-nervous-system-is-fried.pdf","preview":"assets/handouts/when-your-nervous-system-is-fried.png","keywords":["overwhelmed","fried","dysregulated","polyvagal","coping","calm","self-care","sensory","burnout","stress relief"],"featured":true},{"title":"Oh, the Places You Will Go","audience":["parents"],"topics":["attachment","independence"],"type":"Visual handout","description":"A reflective parenting message about being a secure base while children grow toward independence.","file":"assets/handouts/places-you-will-go.jpeg","featured":true},{"title":"Three Types of Engagement","audience":["parents"],"topics":["parenting","connection"],"type":"Visual handout","description":"A quick guide to playful, structured, and calming engagement.","file":"assets/handouts/three-types-engagement.jpeg","featured":true},{"title":"Positive Engagement: Redos & Compromise","audience":["parents"],"topics":["parenting","repair"],"type":"Visual handout","description":"Practical ways to support respectful re-dos, repair, and collaborative compromise.","file":"assets/handouts/positive-engagement-redos.jpeg","featured":false},{"title":"Positive Engagement: Sharing Choice","audience":["parents"],"topics":["parenting","choice"],"type":"Visual handout","description":"Developmentally appropriate choices and collaborative problem-solving.","file":"assets/handouts/positive-engagement-sharing-choice.jpeg","featured":false},{"title":"Positive Engagement: Giving Voice","audience":["parents"],"topics":["communication","connection"],"type":"Visual handout","description":"Open-ended questions, emotional reflection, and family rituals that support voice.","file":"assets/handouts/positive-engagement-giving-voice.jpeg","featured":false},{"title":"Structure & Predictability","audience":["parents"],"topics":["parenting","routines"],"type":"Visual handout","description":"Transitions, sequencing, routines, clear instructions, and visual supports.","file":"assets/handouts/structure.jpeg","featured":true},{"title":"Upstairs and Downstairs Brain","audience":["parents","individuals","teens"],"topics":["nervous-system","regulation"],"type":"Psychoeducation","description":"A simple visual for understanding survival responses and higher-order thinking.","file":"assets/handouts/upstairs-downstairs-brain.jpeg","featured":true},{"title":"S.O.O.T.H.E. Technique","audience":["parents"],"topics":["co-regulation","parenting"],"type":"Skill guide","description":"A concise co-regulation sequence emphasizing tone, organization, choice, togetherness, and closure.","file":"assets/handouts/soothe-technique.jpeg","featured":true},{"title":"Anchor Below Your Child","audience":["parents"],"topics":["co-regulation","attachment"],"type":"Visual handout","description":"A reminder to regulate your own body and tone before guiding a distressed child.","file":"assets/handouts/anchor-below-child.jpeg","featured":true},{"title":"Anchoring the Family","audience":["parents","families"],"topics":["attachment","family-values"],"type":"Visual handout","description":"Ideas for secure attachment, family rituals, shared values, and belonging.","file":"assets/handouts/anchoring-family.jpeg","featured":true}];

const titleCase = value => value
  .replaceAll('-', ' ')
  .replace(/\b\w/g, letter => letter.toUpperCase());

async function loadResources() {
  if (!resourceGrid) return;

  // Use the embedded copy immediately so search works in local previews,
  // GitHub Desktop previews, and deployed versions of the site.
  resources = embeddedResources;
  populateTopics(resources);
  render(resources);

  // Refresh from the JSON file when the site is served over HTTP/HTTPS.
  // Browsers commonly block fetch() from file:// pages, so failure here is harmless.
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    try {
      const response = await fetch('data/resources.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to load resources.');
      resources = await response.json();
      populateTopics(resources);
      render(resources);
    } catch (error) {
      console.warn('Using embedded Toolbox resources.', error);
    }
  }
}

function populateTopics(items) {
  if (!topic) return;
  const topics = [...new Set(items.flatMap(item => item.topics))].sort();
  topic.innerHTML = '<option value="all">All topics</option>' + topics
    .map(item => `<option value="${item}">${titleCase(item)}</option>`)
    .join('');
}

function setAudience(value) {
  activeAudience = value;
  document.querySelectorAll('[data-audience]').forEach(button => {
    button.classList.toggle('active', button.dataset.audience === value);
  });
  render(resources);
}

function clearFilters() {
  if (search) search.value = '';
  if (topic) topic.value = 'all';
  setAudience('all');
}

function render(items) {
  const query = (search?.value || '').toLowerCase().trim();
  const selectedTopic = topic?.value || 'all';
  const searchAliases = {
    trauma: ['trauma', 'nervous-system', 'regulation', 'co-regulation', 'attachment', 'safety'],
    anxiety: ['anxiety', 'regulation', 'nervous-system', 'grounding', 'calming', 'soothe'],
    stress: ['stress', 'regulation', 'nervous-system', 'calming', 'soothe'],
    emotions: ['emotion', 'regulation', 'co-regulation', 'communication'],
    relationship: ['relationship', 'connection', 'attachment', 'communication', 'repair'],
    relationships: ['relationship', 'connection', 'attachment', 'communication', 'repair'],
    child: ['child', 'children', 'parenting', 'parents', 'teens'],
    children: ['child', 'children', 'parenting', 'parents', 'teens'],
    coping: ['coping', 'regulation', 'soothe', 'nervous-system'],
    grounding: ['grounding', 'regulation', 'nervous-system', 'soothe']
  };
  const queryTerms = query ? (searchAliases[query] || [query]) : [];
  const filtered = items.filter(item => {
    const searchableText = [
      item.title,
      item.description,
      item.type,
      ...(item.audience || []),
      ...(item.topics || []),
      ...(item.keywords || [])
    ].join(' ').toLowerCase();
    const matchesSearch = !query || queryTerms.some(term => searchableText.includes(term));
    const matchesAudience = activeAudience === 'all' || item.audience.includes(activeAudience);
    const matchesTopic = selectedTopic === 'all' || item.topics.includes(selectedTopic);
    return matchesSearch && matchesAudience && matchesTopic;
  });

  if (count) count.textContent = `${filtered.length} tool${filtered.length === 1 ? '' : 's'}`;
  if (heroSearchStatus) {
    heroSearchStatus.innerHTML = query
      ? `${filtered.length} tool${filtered.length === 1 ? '' : 's'} found. <a href="#library">View results</a>`
      : 'Start typing to search all tools.';
  }
  if (emptyState) emptyState.hidden = filtered.length !== 0;
  resourceGrid.hidden = filtered.length === 0;

  const filters = [];
  if (query) filters.push(`search: “${query}”`);
  if (activeAudience !== 'all') filters.push(`audience: ${titleCase(activeAudience)}`);
  if (selectedTopic !== 'all') filters.push(`topic: ${titleCase(selectedTopic)}`);
  if (activeFilterNote) {
    activeFilterNote.hidden = filters.length === 0;
    activeFilterNote.textContent = filters.length ? `Showing tools for ${filters.join(' · ')}` : '';
  }

  resourceGrid.innerHTML = filtered.map(item => `
    <article class="card resource-card">
      <img src="${item.preview || item.file}" alt="Preview of ${item.title}" loading="lazy">
      <div class="resource-body">
        <div class="resource-type-row">
          <span class="resource-type">${item.type}</span>
          ${item.featured ? '<span class="featured-badge">Featured</span>' : ''}
        </div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="tags">
          ${item.audience.map(value => `<span class="tag">${titleCase(value)}</span>`).join('')}
          ${item.topics.slice(0, 3).map(value => `<span class="tag">${titleCase(value)}</span>`).join('')}
        </div>
        <div class="resource-actions">
          <button class="btn btn-primary" type="button" data-view="${item.preview || item.file}" data-title="${item.title}">Preview</button>
          <a class="btn btn-secondary" href="${item.file}" download>Download</a>
        </div>
      </div>
    </article>
  `).join('');
}

search?.addEventListener('input', () => render(resources));
search?.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    render(resources);
    document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
topic?.addEventListener('input', () => render(resources));
document.querySelectorAll('[data-audience]').forEach(button => {
  button.addEventListener('click', () => setAudience(button.dataset.audience));
});
document.querySelectorAll('[data-search]').forEach(button => {
  button.addEventListener('click', () => {
    if (search) search.value = button.dataset.search;
    render(resources);
    document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' });
  });
});
document.querySelectorAll('[data-topic]').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.topic;
    if (selected === 'all') {
      clearFilters();
    } else if (topic) {
      topic.value = [...topic.options].some(option => option.value === selected) ? selected : 'all';
      if (topic.value === 'all' && search) search.value = selected;
      render(resources);
    }
    document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' });
  });
});
clearFiltersButton?.addEventListener('click', clearFilters);
document.addEventListener('click', event => {
  if (event.target.closest('[data-clear-all]')) clearFilters();
});
loadResources();

const modal = document.getElementById('resource-modal');
document.addEventListener('click', event => {
  const button = event.target.closest('[data-view]');
  if (button && modal) {
    const image = document.getElementById('modal-image');
    image.src = button.dataset.view;
    image.alt = button.dataset.title;
    document.getElementById('modal-title').textContent = button.dataset.title;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close')?.focus();
  }
  if (event.target.matches('.modal-close') || event.target === modal) closeModal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

const stickyHeader = document.querySelector('[data-sticky-header]');
function updateStickyHeader() {
  stickyHeader?.classList.toggle('is-scrolled', window.scrollY > 70);
}
updateStickyHeader();
window.addEventListener('scroll', updateStickyHeader, { passive: true });


// Ocean Toolkit shortcut controls
function toolkitJumpToLibrary() {
  document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.querySelectorAll('[data-audience-shortcut]').forEach(button => {
  button.addEventListener('click', () => {
    setAudience(button.dataset.audienceShortcut);
    toolkitJumpToLibrary();
  });
});
document.querySelectorAll('[data-topic-shortcut]').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.topicShortcut;
    const optionExists = topic && [...topic.options].some(option => option.value === selected);
    if (optionExists) {
      topic.value = selected;
      if (search) search.value = '';
    } else {
      if (topic) topic.value = 'all';
      if (search) search.value = selected;
    }
    render(resources);
    toolkitJumpToLibrary();
  });
});
