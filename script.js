/* TaskFlow keeps its small data set in localStorage so it works without a server. */
const STORAGE_KEY = 'taskflow_tasks';
const categories = ['Work', 'Personal', 'Study', 'Other'];

let tasks = loadFromLocalStorage();
let activeFilter = 'all';
let searchQuery = '';
let toastTimer;

const elements = {
  form: document.querySelector('#task-form'),
  title: document.querySelector('#task-title'),
  category: document.querySelector('#task-category'),
  dueDate: document.querySelector('#task-due'),
  error: document.querySelector('#form-error'),
  list: document.querySelector('#task-list'),
  search: document.querySelector('#search-input'),
  filters: [...document.querySelectorAll('.filter-button')],
  total: document.querySelector('#total-count'),
  active: document.querySelector('#active-count'),
  completed: document.querySelector('#completed-count'),
  visible: document.querySelector('#visible-count'),
  allFilterCount: document.querySelector('#filter-all-count'),
  activeFilterCount: document.querySelector('#filter-active-count'),
  completedFilterCount: document.querySelector('#filter-completed-count'),
  clearCompleted: document.querySelector('#clear-completed'),
  progressPercent: document.querySelector('#progress-percent'),
  progressFill: document.querySelector('#progress-fill'),
  progressBar: document.querySelector('#progress-bar'),
  progressCaption: document.querySelector('#progress-caption'),
  toast: document.querySelector('#toast')
};

function loadFromLocalStorage() {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (!storedTasks) return [];
    const parsedTasks = JSON.parse(storedTasks);
    if (!Array.isArray(parsedTasks)) return [];
    return parsedTasks.filter(task => task && typeof task.id === 'string' &&
      typeof task.title === 'string' && task.title.trim() &&
      categories.includes(task.category) && typeof task.completed === 'boolean')
      .map(task => ({
        id: task.id,
        title: task.title.trim(),
        category: task.category,
        dueDate: typeof task.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) ? task.dueDate : '',
        completed: task.completed,
        createdAt: typeof task.createdAt === 'string' ? task.createdAt : new Date().toISOString()
      }));
  } catch (error) {
    console.warn('TaskFlow could not read saved tasks.', error);
    return [];
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.warn('TaskFlow could not save tasks.', error);
    showToast('Could not save changes on this device.');
    return false;
  }
}

function createTask(title, category, dueDate) {
  return { id: (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`), title, category, dueDate, completed: false, createdAt: new Date().toISOString() };
}

function getVisibleTasks() {
  return tasks.filter(task => {
    const matchesFilter = activeFilter === 'all' ||
      (activeFilter === 'active' && !task.completed) ||
      (activeFilter === 'completed' && task.completed);
    return matchesFilter && task.title.toLocaleLowerCase().includes(searchQuery);
  });
}

function formatDueDate(dueDate) {
  const [year, month, day] = dueDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getDueState(task) {
  if (!task.dueDate || task.completed) return { label: task.dueDate ? `Due ${formatDueDate(task.dueDate)}` : '', className: '' };
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  if (task.dueDate < todayKey) return { label: `Overdue · ${formatDueDate(task.dueDate)}`, className: 'is-overdue' };
  if (task.dueDate === todayKey) return { label: 'Due today', className: 'is-today' };
  return { label: `Due ${formatDueDate(task.dueDate)}`, className: '' };
}

function makeIconButton(label, icon, extraClass = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `icon-button ${extraClass}`.trim();
  button.setAttribute('aria-label', label);
  button.title = label;
  button.innerHTML = icon;
  return button;
}

function renderTask(task) {
  const card = document.createElement('article');
  card.className = `task-card${task.completed ? ' is-completed' : ''}`;
  card.dataset.taskId = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-check';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', `${task.completed ? 'Mark active' : 'Mark completed'}: ${task.title}`);
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const main = document.createElement('div');
  main.className = 'task-main';
  const title = document.createElement('div');
  title.className = 'task-title';
  title.textContent = task.title;
  main.append(title);

  const meta = document.createElement('div');
  meta.className = 'task-meta';
  const category = document.createElement('span');
  category.className = `category-badge category-${task.category.toLowerCase()}`;
  category.textContent = task.category;
  meta.append(category);
  const due = getDueState(task);
  if (due.label) {
    const dueBadge = document.createElement('span');
    dueBadge.className = `due-badge ${due.className}`.trim();
    dueBadge.textContent = due.label;
    meta.append(dueBadge);
  }
  main.append(meta);

  const actions = document.createElement('div');
  actions.className = 'task-actions';
  const editButton = makeIconButton(`Edit ${task.title}`, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>');
  editButton.addEventListener('click', () => editTask(task.id));
  const deleteButton = makeIconButton(`Delete ${task.title}`, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/></svg>', 'delete-button');
  deleteButton.addEventListener('click', () => deleteTask(task.id));
  actions.append(editButton, deleteButton);
  card.append(checkbox, main, actions);
  return card;
}

function renderEmptyState() {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  const illustration = document.createElement('div');
  illustration.className = 'empty-illustration';
  illustration.setAttribute('aria-hidden', 'true');
  illustration.textContent = searchQuery ? '⌕' : activeFilter === 'completed' ? '✓' : '✦';
  const title = document.createElement('h3');
  const message = document.createElement('p');
  if (searchQuery) {
    title.textContent = 'No tasks found';
    message.textContent = 'Try a different search or filter.';
  } else if (activeFilter === 'active' && tasks.length) {
    title.textContent = 'All caught up!';
    message.textContent = 'You have no active tasks right now.';
  } else if (activeFilter === 'completed' && tasks.length) {
    title.textContent = 'Nothing completed yet';
    message.textContent = 'Finished tasks will show up here.';
  } else {
    title.textContent = 'A fresh start';
    message.textContent = 'Add your first task above and make today count.';
  }
  empty.append(illustration, title, message);
  return empty;
}

function render() {
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.length - activeCount;
  const percent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  elements.total.textContent = tasks.length;
  elements.active.textContent = activeCount;
  elements.completed.textContent = completedCount;
  elements.allFilterCount.textContent = tasks.length;
  elements.activeFilterCount.textContent = activeCount;
  elements.completedFilterCount.textContent = completedCount;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressFill.style.width = `${percent}%`;
  elements.progressBar.setAttribute('aria-valuenow', String(percent));
  elements.progressCaption.textContent = tasks.length
    ? `${completedCount} of ${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} completed. Keep that momentum going!`
    : 'Add a task and get started.';
  elements.clearCompleted.disabled = completedCount === 0;

  const visibleTasks = getVisibleTasks();
  elements.visible.textContent = visibleTasks.length;
  elements.list.replaceChildren();
  if (!visibleTasks.length) elements.list.append(renderEmptyState());
  else visibleTasks.forEach(task => elements.list.append(renderTask(task)));
}

function showError(message) {
  elements.error.textContent = message;
  elements.error.classList.toggle('is-visible', Boolean(message));
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove('is-visible'), 2200);
}

function addTask(event) {
  event.preventDefault();
  const title = elements.title.value.trim();
  if (!title) {
    showError('Give your task a name before adding it.');
    elements.title.focus();
    return;
  }
  tasks.unshift(createTask(title, elements.category.value, elements.dueDate.value));
  saveToLocalStorage();
  elements.form.reset();
  showError('');
  activeFilter = 'all';
  elements.filters.forEach(button => {
    const selected = button.dataset.filter === activeFilter;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  render();
  elements.title.focus();
  showToast('Task added to your list');
}

function toggleTask(taskId) {
  const task = tasks.find(item => item.id === taskId);
  if (!task) return;
  task.completed = !task.completed;
  saveToLocalStorage();
  render();
  showToast(task.completed ? 'Nicely done! Task completed' : 'Task moved back to active');
}

function editTask(taskId) {
  const task = tasks.find(item => item.id === taskId);
  if (!task) return;
  const nextTitle = window.prompt('Edit task title:', task.title);
  if (nextTitle === null) return;
  const title = nextTitle.trim();
  if (!title) {
    showToast('A task title cannot be empty');
    return;
  }
  const nextCategory = window.prompt('Category: Work, Personal, Study, or Other', task.category);
  if (nextCategory === null) return;
  const category = categories.find(item => item.toLowerCase() === nextCategory.trim().toLowerCase());
  if (!category) {
    showToast('Please choose Work, Personal, Study, or Other');
    return;
  }
  const nextDueDate = window.prompt('Due date (YYYY-MM-DD), or leave blank:', task.dueDate);
  if (nextDueDate === null) return;
  const dueDate = nextDueDate.trim();
  if (dueDate && !isValidDate(dueDate)) {
    showToast('Enter a valid due date as YYYY-MM-DD');
    return;
  }
  task.title = title;
  task.category = category;
  task.dueDate = dueDate;
  saveToLocalStorage();
  render();
  showToast('Task updated');
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function deleteTask(taskId) {
  const task = tasks.find(item => item.id === taskId);
  if (!task || !window.confirm(`Delete “${task.title}”?`)) return;
  tasks = tasks.filter(item => item.id !== taskId);
  saveToLocalStorage();
  render();
  showToast('Task deleted');
}

function clearCompletedTasks() {
  const completedCount = tasks.filter(task => task.completed).length;
  if (!completedCount || !window.confirm(`Clear all ${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}?`)) return;
  tasks = tasks.filter(task => !task.completed);
  saveToLocalStorage();
  render();
  showToast('Completed tasks cleared');
}

elements.form.addEventListener('submit', addTask);
elements.title.addEventListener('input', () => { if (elements.title.value.trim()) showError(''); });
elements.search.addEventListener('input', () => {
  searchQuery = elements.search.value.trim().toLocaleLowerCase();
  render();
});
elements.filters.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  elements.filters.forEach(filterButton => {
    const selected = filterButton === button;
    filterButton.classList.toggle('is-selected', selected);
    filterButton.setAttribute('aria-pressed', String(selected));
  });
  render();
}));
elements.clearCompleted.addEventListener('click', clearCompletedTasks);

const dateLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
document.querySelector('#today-label').textContent = dateLabel.format(new Date());
render();
