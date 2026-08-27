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
const emptyTitle = emptyState?.querySelector('h3');
const emptyCopy = emptyState?.querySelector('p');

const filterState = {
  audience: 'all',
  topic: 'all',
  search: ''
};
let topicSource = null;
let resources = [];
const embeddedResources = [{"title":"Two Sides of the Street","audience":["couples","individuals"],"topics":["relationships","accountability","boundaries","communication","repair","shared-responsibility","relational-patterns"],"type":"Relationship handout","description":"A visual guide to owning personal triggers, wounds, choices, and patterns while sharing responsibility for communication, repair, trust, and the relationship built in the middle.","file":"assets/handouts/two-sides-of-the-street.png","keywords":["couples","relationship work","clean your side of the street","personal responsibility","shared responsibility","accountability","unhealed wounds","unhealthy patterns","triggers","ownership","conflict","rupture and repair","emotional safety","trust","teamwork"],"featured":true},{"title":"ACT Limit Setting: A Parent Guide","audience":["parents","families"],"topics":["parenting","boundaries","setting-limits","act","connection"],"type":"Parent guide","description":"A calm, connection-centered three-step approach for acknowledging a child's feelings, communicating a clear limit, and targeting safe alternatives.","file":"assets/handouts/act-limit-setting-parent-guide.pdf","preview":"assets/handouts/act-limit-setting-parent-guide.png","keywords":["ACT","acknowledge","communicate","target","limit setting","boundaries","parenting","discipline","choices","behavior","connection"],"featured":true},{"title":"What to Do When Your Nervous System Is Fried","audience":["individuals","teens","parents"],"topics":["nervous-system","regulation","grounding","stress","burnout"],"type":"Visual handout","description":"A practical visual menu of simple sensory, movement, connection, rest, and grounding ideas for moments of overwhelm or nervous-system overload.","file":"assets/handouts/when-your-nervous-system-is-fried.pdf","preview":"assets/handouts/when-your-nervous-system-is-fried.png","keywords":["overwhelmed","fried","dysregulated","polyvagal","coping","calm","self-care","sensory","burnout","stress relief"],"featured":true},{"title":"Parts Work for Parenting: Our Struggles Have Stories","audience":["parents","individuals"],"topics":["parenting","parts-work","childhood-wounds","self-compassion","emotional-regulation"],"type":"Reflective handout","description":"Explore how protector and exile parts shaped by childhood experiences can show up in parenting, then practice five steps for responding with greater awareness, compassion, and intention.","file":"assets/handouts/parts-work-for-parenting.pdf","preview":"assets/handouts/parts-work-for-parenting.png","keywords":["IFS","internal family systems","protector parts","exiles","parent triggers","reactive parenting","cycle breaking","generational trauma","healing the parent within","parent consciously","pause button","oxygen mask","childhood adaptations"],"featured":true},{"title":"Oh, the Places You Will Go","audience":["parents"],"topics":["parenting","attachment","independence","connection"],"type":"Parent reflection","description":"A reflective parenting message about being a secure base while children grow toward independence.","file":"assets/handouts/places-you-will-go.jpeg","keywords":["raising children","secure attachment","secure base","safe harbor","confidence","curiosity","empathy","exploration","growing up"],"featured":true},{"title":"Three Types of Engagement","audience":["parents"],"topics":["parenting","connection","co-regulation","communication","boundaries"],"type":"Parent guide","description":"A quick guide to playful, structured, and calming engagement.","file":"assets/handouts/three-types-engagement.jpeg","keywords":["playful engagement","structured engagement","calming engagement","tone of voice","redos","choices","emotion regulation"],"featured":true},{"title":"Positive Engagement: Redos & Compromise","audience":["parents"],"topics":["parenting","repair","communication","connection"],"type":"Skill guide","description":"Practical ways to support respectful re-dos, repair, and collaborative compromise.","file":"assets/handouts/positive-engagement-redos.jpeg","keywords":["try again","redos","compromise","conflict resolution","collaboration","apologizing","asking for help","kindness","same team","middle ground"],"featured":false},{"title":"Positive Engagement: Sharing Choice","audience":["parents"],"topics":["parenting","choices","boundaries","communication"],"type":"Skill guide","description":"Developmentally appropriate choices and collaborative problem-solving.","file":"assets/handouts/positive-engagement-sharing-choice.jpeg","keywords":["limited choices","developmentally appropriate choices","collaborative problem solving","responsibility","screen time","decision making","shared control"],"featured":false},{"title":"Positive Engagement: Giving Voice","audience":["parents"],"topics":["parenting","communication","connection","family-rituals"],"type":"Skill guide","description":"Open-ended questions, emotional reflection, and family rituals that support voice.","file":"assets/handouts/positive-engagement-giving-voice.jpeg","keywords":["giving voice","open-ended questions","emotional validation","reflecting feelings","mirroring emotions","rose and thorn","family check-in","listening"],"featured":false},{"title":"Structure & Predictability","audience":["parents"],"topics":["parenting","routines","transitions","behavior-support"],"type":"Parent guide","description":"Transitions, sequencing, routines, clear instructions, and visual supports.","file":"assets/handouts/structure.jpeg","keywords":["predictability","advance warnings","sequencing tasks","executive functioning","clear instructions","visual supports","checklists","picture cards","daily expectations"],"featured":true},{"title":"Upstairs and Downstairs Brain","audience":["parents","individuals","teens"],"topics":["nervous-system","regulation","brain-development","stress-response"],"type":"Psychoeducation","description":"A simple visual for understanding survival responses and higher-order thinking.","file":"assets/handouts/upstairs-downstairs-brain.jpeg","keywords":["upstairs brain","downstairs brain","prefrontal cortex","survival brain","fight flight freeze","decision making","self-regulation","psychoeducation","Dan Siegel"],"featured":true},{"title":"S.O.O.T.H.E. Technique","audience":["parents"],"topics":["parenting","co-regulation","communication","attachment"],"type":"Skill guide","description":"A concise co-regulation sequence emphasizing tone, organization, choice, togetherness, and closure.","file":"assets/handouts/soothe-technique.jpeg","keywords":["SOOTHE","soft tone","organize the child's experience","offer choices","touch","togetherness","underlying concern","calming"],"featured":true},{"title":"Anchor Below Your Child","audience":["parents"],"topics":["parenting","co-regulation","nervous-system","attachment"],"type":"Visual reminder","description":"A reminder to regulate your own body and tone before guiding a distressed child.","file":"assets/handouts/anchor-below-child.jpeg","keywords":["parent as anchor","breathe deeply","regulate first","parent regulation","calm presence","Paris Goodyear-Brown"],"featured":true},{"title":"Anchoring the Family","audience":["parents","families"],"topics":["parenting","attachment","connection","family-values","family-rituals","belonging"],"type":"Family reflection","description":"Ideas for secure attachment, family rituals, shared values, and belonging.","file":"assets/handouts/anchoring-family.jpeg","keywords":["secure attachment","family connection","shared meals","question jar","game night","quality time","core values","family closeness"],"featured":true}];

const audienceAliases = {
  all: 'all',
  everyone: 'all',
  adult: 'adults',
  adults: 'adults',
  individual: 'adults',
  individuals: 'adults',
  parent: 'parents',
  parents: 'parents',
  teen: 'teens',
  teens: 'teens',
  family: 'families',
  families: 'families',
  couple: 'couples',
  couples: 'couples'
};

const topicAliases = {
  connection: 'relationships',
  connections: 'relationships',
  relationship: 'relationships',
  'emdr-therapy': 'emdr'
};

const topicLabelOverrides = {
  act: 'ACT',
  cbt: 'CBT',
  dbt: 'DBT',
  emdr: 'EMDR',
  'ifs-parts-work': 'IFS / Parts Work'
};

function normalizeBase(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeAudience(value) {
  const normalized = normalizeBase(value);
  return audienceAliases[normalized] || normalized;
}

function normalizeTopic(value) {
  const normalized = normalizeBase(value);
  return topicAliases[normalized] || normalized;
}

function titleCase(value) {
  const normalized = normalizeBase(value);
  if (topicLabelOverrides[normalized]) return topicLabelOverrides[normalized];
  return normalized
    .replaceAll('-', ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function audienceLabel(value) {
  const normalized = normalizeAudience(value);
  const labels = { all: 'Everyone', adults: 'Adults', parents: 'Parents', teens: 'Teens', families: 'Families', couples: 'Couples' };
  return labels[normalized] || titleCase(normalized);
}

function getItemAudiences(item) {
  return [...new Set((item.audience || []).map(normalizeAudience).filter(Boolean))];
}

function getItemTopics(item) {
  return [...new Set((item.topics || []).map(normalizeTopic).filter(Boolean))];
}

function syncFilterControls() {
  document.querySelectorAll('[data-audience]').forEach(button => {
    const isActive = normalizeAudience(button.dataset.audience) === filterState.audience;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (topic) {
    const optionExists = [...topic.options].some(option => option.value === filterState.topic);
    topic.value = optionExists ? filterState.topic : 'all';
  }

  document.querySelectorAll('[data-topic-shortcut], [data-topic]').forEach(button => {
    const raw = button.dataset.topicShortcut ?? button.dataset.topic;
    const isActive = topicSource === 'top' && normalizeTopic(raw) === filterState.topic && filterState.topic !== 'all';
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function updateUrl() {
  if (!window.history?.replaceState || window.location.protocol === 'file:') return;
  const url = new URL(window.location.href);
  if (filterState.audience === 'all') url.searchParams.delete('audience');
  else url.searchParams.set('audience', filterState.audience);
  if (filterState.topic === 'all') url.searchParams.delete('topic');
  else url.searchParams.set('topic', filterState.topic);
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function readUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  filterState.audience = normalizeAudience(params.get('audience') || 'all') || 'all';
  filterState.topic = normalizeTopic(params.get('topic') || 'all') || 'all';
}

async function loadResources() {
  if (!resourceGrid) return;

  readUrlFilters();
  resources = embeddedResources;
  populateTopics(resources);
  syncFilterControls();
  render(resources, { updateHistory: false });

  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    try {
      const response = await fetch('data/resources.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to load resources.');
      resources = await response.json();
      populateTopics(resources);
      syncFilterControls();
      render(resources, { updateHistory: false });
    } catch (error) {
      console.warn('Using embedded Toolbox resources.', error);
    }
  }
}

function populateTopics(items) {
  if (!topic) return;
  const topics = [...new Set(items.flatMap(getItemTopics))].sort((a, b) => titleCase(a).localeCompare(titleCase(b)));
  topic.innerHTML = '<option value="all">All topics</option>' + topics
    .map(item => `<option value="${item}">${titleCase(item)}</option>`)
    .join('');
}

function setAudience(value) {
  filterState.audience = normalizeAudience(value) || 'all';
  syncFilterControls();
  render(resources);
}

function setTopic(value, source = 'lower') {
  filterState.topic = normalizeTopic(value) || 'all';
  topicSource = filterState.topic === 'all' ? null : source;
  syncFilterControls();
  render(resources);
}

function clearFilters() {
  filterState.audience = 'any';
  filterState.topic = 'all';
  filterState.search = '';
  topicSource = null;
  if (search) search.value = '';
  syncFilterControls();
  render(resources);
}

function render(items, { updateHistory = true } = {}) {
  filterState.search = (search?.value || '').toLowerCase().trim();
  const query = filterState.search;
  const selectedTopic = normalizeTopic(filterState.topic || 'all');
  const searchAliases = {
    trauma: ['trauma', 'nervous-system', 'regulation', 'co-regulation', 'attachment', 'safety'],
    anxiety: ['anxiety', 'regulation', 'nervous-system', 'grounding', 'calming', 'soothe'],
    stress: ['stress', 'regulation', 'nervous-system', 'calming', 'soothe'],
    emotions: ['emotion', 'regulation', 'co-regulation', 'communication'],
    relationship: ['relationship', 'relationships', 'connection', 'attachment', 'communication', 'repair'],
    relationships: ['relationship', 'relationships', 'connection', 'attachment', 'communication', 'repair'],
    child: ['child', 'children', 'parenting', 'parents', 'teens'],
    children: ['child', 'children', 'parenting', 'parents', 'teens'],
    coping: ['coping', 'regulation', 'soothe', 'nervous-system'],
    grounding: ['grounding', 'regulation', 'nervous-system', 'soothe']
  };
  const queryTerms = query ? (searchAliases[query] || [query]) : [];

  const filtered = items.filter(item => {
    const itemAudiences = getItemAudiences(item);
    const itemTopics = getItemTopics(item);
    const searchableText = [
      item.title,
      item.description,
      item.type,
      ...(item.audience || []),
      ...(item.topics || []),
      ...(item.keywords || [])
    ].join(' ').toLowerCase();
    const matchesSearch = !query || queryTerms.some(term => searchableText.includes(term));
    const matchesAudience = filterState.audience === 'any' || itemAudiences.includes(filterState.audience);
    const matchesTopic = selectedTopic === 'all' || itemTopics.includes(selectedTopic);
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

  const filterDescriptions = [];
  if (query) filterDescriptions.push(`search: “${query}”`);
  if (filterState.audience !== 'all') filterDescriptions.push(`audience: ${audienceLabel(filterState.audience)}`);
  if (selectedTopic !== 'all') filterDescriptions.push(`topic: ${titleCase(selectedTopic)}`);
  if (activeFilterNote) {
    activeFilterNote.hidden = filterDescriptions.length === 0;
    activeFilterNote.textContent = filterDescriptions.length ? `Showing tools for ${filterDescriptions.join(' · ')}` : '';
  }

  if (filtered.length === 0) {
    const plainFilters = [];
    if (filterState.audience !== 'all') plainFilters.push(audienceLabel(filterState.audience));
    if (selectedTopic !== 'all') plainFilters.push(titleCase(selectedTopic));
    if (query) plainFilters.push(`“${query}”`);
    if (emptyTitle) emptyTitle.textContent = plainFilters.length ? `No tools found for ${plainFilters.join(' + ')}` : 'No tools found';
    if (emptyCopy) emptyCopy.textContent = 'Try another topic, change the audience, or view all tools.';
  }

  resourceGrid.innerHTML = filtered.map(item => `
    <article class="card resource-card resource-card-open" tabindex="0" role="button" aria-label="Open ${item.title}" data-resource-file="${item.file}" data-resource-title="${item.title}" data-resource-type="${item.type}">
      <img src="${item.preview || item.file}" alt="Preview of ${item.title}" loading="lazy">
      <div class="resource-body">
        <div class="resource-type-row">
          <span class="resource-type">${item.type}</span>
          ${item.featured ? '<span class="featured-badge">Featured</span>' : ''}
        </div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="tags">
          ${getItemAudiences(item).map(value => `<span class="tag">${audienceLabel(value)}</span>`).join('')}
          ${getItemTopics(item).slice(0, 3).map(value => `<span class="tag">${titleCase(value)}</span>`).join('')}
        </div>
        <div class="resource-actions">
          <span class="open-resource-label">Open full handout <span aria-hidden="true">→</span></span>
          <a class="btn btn-secondary resource-download" href="${item.file}" download>Download</a>
        </div>
      </div>
    </article>
  `).join('');

  if (updateHistory) updateUrl();
}

function toolkitJumpToLibrary() {
  document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

search?.addEventListener('input', () => render(resources));
search?.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    render(resources);
    toolkitJumpToLibrary();
  }
});

topic?.addEventListener('change', () => {
  setTopic(topic.value, 'lower');
});

document.querySelectorAll('[data-audience]').forEach(button => {
  button.addEventListener('click', () => setAudience(button.dataset.audience));
});

document.querySelectorAll('[data-audience-shortcut]').forEach(button => {
  button.addEventListener('click', () => {
    setAudience(button.dataset.audienceShortcut);
    toolkitJumpToLibrary();
  });
});

document.querySelectorAll('[data-search]').forEach(button => {
  button.addEventListener('click', () => {
    if (search) search.value = button.dataset.search;
    render(resources);
    toolkitJumpToLibrary();
  });
});

document.querySelectorAll('[data-topic-shortcut], [data-topic]').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.topicShortcut ?? button.dataset.topic;
    if (selected === 'all') clearFilters();
    else setTopic(selected, 'top');
    toolkitJumpToLibrary();
  });
});

clearFiltersButton?.addEventListener('click', clearFilters);
document.addEventListener('click', event => {
  if (event.target.closest('[data-clear-all]')) clearFilters();
});

window.addEventListener('popstate', () => {
  readUrlFilters();
  topicSource = null;
  syncFilterControls();
  render(resources, { updateHistory: false });
});

loadResources();

const modal = document.getElementById('resource-modal');
let lastFocusedResource = null;

function openResource(card) {
  if (!modal || !card) return;
  const file = card.dataset.resourceFile;
  const title = card.dataset.resourceTitle;
  const viewer = document.getElementById('modal-viewer');
  const download = document.getElementById('modal-download');
  const isPdf = /\.pdf(?:$|[?#])/i.test(file);

  lastFocusedResource = card;
  document.getElementById('modal-title').textContent = title;
  download.href = file;
  download.setAttribute('download', '');
  viewer.innerHTML = isPdf
    ? `<iframe class="resource-pdf" src="${file}#view=FitH&toolbar=1&navpanes=0" title="${title}"></iframe>`
    : `<img class="resource-full-image" src="${file}" alt="${title}">`;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close')?.focus();
}

document.addEventListener('click', event => {
  if (event.target.closest('.resource-download')) return;
  const card = event.target.closest('[data-resource-file]');
  if (card) openResource(card);
  if (event.target.matches('.modal-close') || event.target === modal) closeModal();
});

document.addEventListener('keydown', event => {
  const card = event.target.closest?.('[data-resource-file]');
  if (card && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    openResource(card);
  }
  if (event.key === 'Escape') closeModal();
});

function closeModal() {
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  const viewer = document.getElementById('modal-viewer');
  if (viewer) viewer.innerHTML = '';
  lastFocusedResource?.focus();
}

const stickyHeader = document.querySelector('[data-sticky-header]');
function updateStickyHeader() {
  stickyHeader?.classList.toggle('is-scrolled', window.scrollY > 70);
}
updateStickyHeader();
window.addEventListener('scroll', updateStickyHeader, { passive: true });


// Subtle entrance motion for the Toolbox. Respects reduced-motion preferences.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  const observeReveals = () => document.querySelectorAll('.reveal-section,.editorial-card,.resource-card').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
    revealObserver.observe(el);
  });
  observeReveals();
  new MutationObserver(observeReveals).observe(document.getElementById('resource-grid') || document.body, { childList: true });
} else {
  document.querySelectorAll('.reveal-section,.editorial-card,.resource-card').forEach(el => el.classList.add('is-visible'));
}
