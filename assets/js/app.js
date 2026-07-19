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
let activeAudience = 'all';
let resources = [];

const titleCase = value => value
  .replaceAll('-', ' ')
  .replace(/\b\w/g, letter => letter.toUpperCase());

async function loadResources() {
  if (!resourceGrid) return;
  try {
    const response = await fetch('data/resources.json');
    if (!response.ok) throw new Error('Unable to load resources.');
    resources = await response.json();
    populateTopics(resources);
    render(resources);
  } catch (error) {
    resourceGrid.innerHTML = '<div class="resource-empty"><h3>The Toolkit could not load.</h3><p>Please refresh the page and try again.</p></div>';
    console.error(error);
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
  const filtered = items.filter(item => {
    const searchableText = [item.title, item.description, item.type, ...item.audience, ...item.topics]
      .join(' ')
      .toLowerCase();
    const matchesSearch = !query || searchableText.includes(query);
    const matchesAudience = activeAudience === 'all' || item.audience.includes(activeAudience);
    const matchesTopic = selectedTopic === 'all' || item.topics.includes(selectedTopic);
    return matchesSearch && matchesAudience && matchesTopic;
  });

  if (count) count.textContent = `${filtered.length} tool${filtered.length === 1 ? '' : 's'}`;
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
      <img src="${item.file}" alt="Preview of ${item.title}" loading="lazy">
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
          <button class="btn btn-primary" type="button" data-view="${item.file}" data-title="${item.title}">Preview</button>
          <a class="btn btn-secondary" href="${item.file}" download>Download</a>
        </div>
      </div>
    </article>
  `).join('');
}

search?.addEventListener('input', () => render(resources));
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
