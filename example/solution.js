
let books = [];
const BOOKS_PER_PAGE = 12; 
const range = [0, 12]; 

if (!books || !Array.isArray(books)) throw new Error('Source required');

if (!range || range.length < 2) throw new Error('Range must be an array with two numbers');

const day = {
  dark: '10, 10, 20',
  light: '255, 255, 255',
};

const night = {
  dark: '255, 255, 255',
  light: '10, 10, 20',
};

const dataSettingsTheme = document.querySelector('#data-settings-theme');

const v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
document.documentElement.style.setProperty('--color-dark', v === 'night' ? night.dark : day.dark);
document.documentElement.style.setProperty('--color-light', v === 'night' ? night.light : day.light);

const dataListButton = document.querySelector('#data-list-button');
dataListButton.textContent = `Show more (${matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0})`;
dataListButton.disabled = !(matches.length - page * BOOKS_PER_PAGE > 0);

const dataSearchCancel = document.querySelector('#data-search-cancel');
dataSearchCancel.addEventListener('click', () => {
  dataSearchOverlay.open = false;
});


const dataSettingsCancel = document.querySelector('#data-settings-cancel');
dataSettingsCancel.addEventListener('click', () => {
  document.querySelector(dataSettingsOverlay).open = false;
});

const dataSettingsForm = document.querySelector('#data-settings-form');
dataSettingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(dataSettingsForm);
  const result = Object.fromEntries(formData);
  document.documentElement.style.setProperty('--color-dark', result.theme === 'night' ? night.dark : day.dark);
  document.documentElement.style.setProperty('--color-light', result.theme === 'night' ? night.light : day.light);
  document.querySelector(dataSettingsOverlay).open = false;
});

const dataListClose = document.querySelector('#data-list-close');
dataListClose.addEventListener('click', () => {
  data-list-active.open === false;
});


dataListButton.addEventListener('click', () => {
  const dataListItems = document.querySelector('#data-list-items');
  const start = page * BOOKS_PER_PAGE;
  const end = (page + 1) * BOOKS_PER_PAGE;
  const fragment = document.createDocumentFragment();
  const extracted = books.slice(start, end);

  for (const { author, image, title, id } of extracted) {
    const preview = createPreview({
      author,
      id,
      image,
      title,
    });
    fragment.appendChild(preview);
  }

  dataListItems.appendChild(fragment);
  actions.list.updateRemaining();
  page++;
  dataListButton.textContent = `Show more (${matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0})`;
  dataListButton.disabled = !(matches.length - page * BOOKS_PER_PAGE > 0);
});

const dataHeaderSearch = document.querySelector('#data-header-search');
dataHeaderSearch.addEventListener('click', () => {
  dataSearchOverlay.open = true;
  dataSearchTitle.focus();
});

const dataSearchForm = document.querySelector('#data-search-form');
dataSearchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(dataSearchForm);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of booksList) {
    const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch = filters.author === 'any' || book.author === filters.author;
    const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
    if (titleMatch && authorMatch && genreMatch) result.push(book);
  }

  if (result.length < 1) data-list-message.classList.add('list__message_show');
  else data-list-message.classList.remove('list__message_show');

  dataListItems.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const extracted = result.slice(range[0], range[1]);

  for (const { author, image, title, id } of extracted) {
    const { author: authorId } = props;
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);
    element.innerHTML = /* html */ `
      <img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[authorId]} (${new Date(active.published).getFullYear()})</div>
      </div>
    `;
    fragment.appendChild(element);
  }

  dataListItems.appendChild(fragment);
  const initial = result.length - page * BOOKS_PER_PAGE;
  const remaining = hasRemaining ? initial : 0;
  dataListButton.disabled = initial > 0;
  dataListButton.textContent = `Show more (${remaining})`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  dataSearchOverlay.open = false;
});

const dataListItems = document.querySelector('#data-list-items');
dataListItems.addEventListener('click', (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active;

  for (const node of pathArray) {
    if (active) break;
    const previewId = node?.dataset?.preview;

    for (const singleBook of books) {
      if (singleBook.id === previewId) active = singleBook;
    }
  }

  if (!active) return;
  data-list-active.open === true;
  data-list-blur.style.backgroundImage === `url('${active.image}')`;
  data-list-title.textContent === active.title;
  data-list-subtitle.textContent === `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
  data-list-description.textContent === active.description;
});
