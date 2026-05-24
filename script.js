const STORAGE_KEY = 'portfolioData';
const AUTH_KEY = 'portfolioAdmin';
const ADMIN_USER = 'admin';
const ADMIN_PASS = '2084505jim';
let currentPortfolioData = {};

function createCard(item) {
  const card = document.createElement('article');
  card.className = 'item-card';

  const title = document.createElement('h3');
  title.textContent = item.title;

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `<span>${item.organization}</span><span>${item.date}</span>`;

  const description = document.createElement('p');
  description.textContent = item.description;

  card.append(title, meta, description);
  return card;
}

function renderSection(listId, items) {
  const container = document.getElementById(listId);
  if (!container) return;

  container.innerHTML = '';
  if (!items || items.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No entries yet. Use the admin editor to add content.';
    container.append(empty);
    return;
  }

  items.forEach(item => {
    container.appendChild(createCard(item));
  });
}

function renderContact(contact) {
  const list = document.getElementById('contact-list');
  if (!list || !Array.isArray(contact)) return;
  list.innerHTML = '';

  contact.forEach(item => {
    const link = document.createElement('a');
    link.className = 'contact-link';
    link.href = item.href || '#';
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
    link.innerHTML = `<span>${item.label}</span> ${item.value}`;
    list.appendChild(link);
  });
}

function updateCurrentItemsList(data) {
  const list = document.getElementById('current-items-list');
  if (!list) return;
  list.innerHTML = '';

  ['experiences', 'awards', 'activities'].forEach(section => {
    const sectionData = Array.isArray(data[section]) ? data[section] : [];
    const sectionBlock = document.createElement('div');
    sectionBlock.className = 'admin-item-group';

    const heading = document.createElement('h4');
    heading.textContent = section.charAt(0).toUpperCase() + section.slice(1);
    sectionBlock.appendChild(heading);

    if (sectionData.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'No items yet.';
      sectionBlock.appendChild(empty);
    } else {
      sectionData.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'admin-item-row';

        const summary = document.createElement('div');
        summary.innerHTML = `<strong>${item.title}</strong><span>${item.organization} · ${item.date}</span>`;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removeAdminItem(section, index));

        row.append(summary, removeBtn);
        sectionBlock.appendChild(row);
      });
    }

    list.appendChild(sectionBlock);
  });
}

function setAdminFields(data) {
  document.getElementById('admin-name').value = data.name || '';
  document.getElementById('admin-title').value = data.title || '';
  document.getElementById('admin-intro').value = data.intro || '';
  document.getElementById('admin-contact-copy').value = data.contactCopy || '';
}

function collectAdminData() {
  return {
    ...currentPortfolioData,
    name: document.getElementById('admin-name').value.trim() || 'Your Name',
    title: document.getElementById('admin-title').value.trim() || 'Your Title',
    intro: document.getElementById('admin-intro').value.trim(),
    contactCopy: document.getElementById('admin-contact-copy').value.trim(),
    experiences: currentPortfolioData.experiences || [],
    awards: currentPortfolioData.awards || [],
    activities: currentPortfolioData.activities || [],
    contact: currentPortfolioData.contact || []
  };
}

function removeAdminItem(section, index) {
  const list = currentPortfolioData[section];
  if (!Array.isArray(list) || index < 0 || index >= list.length) return;

  list.splice(index, 1);
  updateCurrentItemsList(currentPortfolioData);
  updatePage(currentPortfolioData);
  showMessage('save-message', 'Item removed. Save changes to persist.', false);
}

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Invalid stored portfolio data, falling back to defaults.', error);
    }
  }
  return window.portfolioData || {};
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function updatePage(data) {
  document.getElementById('name').textContent = data.name || 'Your Name';
  document.getElementById('title').textContent = data.title || 'Your Title';
  document.getElementById('intro').textContent = data.intro || '';
  document.getElementById('contact-copy').textContent = data.contactCopy || '';

  renderSection('experiences-list', data.experiences);
  renderSection('awards-list', data.awards);
  renderSection('activities-list', data.activities);
  renderContact(data.contact);
}

function populateAdminInterface(data) {
  setAdminFields(data);
  updateCurrentItemsList(data);
}

function showAdminPanel(isAuthenticated) {
  const loginPanel = document.getElementById('login-panel');
  const editorPanel = document.getElementById('editor-panel');
  if (!loginPanel || !editorPanel) return;

  loginPanel.classList.toggle('hidden', isAuthenticated);
  editorPanel.classList.toggle('hidden', !isAuthenticated);
}

function getAuthState() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

function setAuthState(value) {
  localStorage.setItem(AUTH_KEY, value ? 'true' : 'false');
}

function showMessage(elementId, message, isError = false) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? '#b91c1c' : '#0f172a';
}

function initializePortfolio() {
  const data = loadData();
  currentPortfolioData = data;
  window.portfolioData = data;
  updatePage(data);
  populateAdminInterface(data);
}

function initializeAdmin() {
  const isAuthenticated = getAuthState();
  showAdminPanel(isAuthenticated);

  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const saveBtn = document.getElementById('save-data-btn');
  const addItemBtn = document.getElementById('add-item-btn');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const username = document.getElementById('login-user')?.value.trim();
      const password = document.getElementById('login-pass')?.value;

      if (username === ADMIN_USER && password === ADMIN_PASS) {
        setAuthState(true);
        showAdminPanel(true);
        showMessage('login-message', 'Login successful! You can now edit the page.', false);
      } else {
        showMessage('login-message', 'Invalid login. Try admin / 2084505jim.', true);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setAuthState(false);
      showAdminPanel(false);
      showMessage('login-message', 'You have been logged out.', false);
      showMessage('save-message', '', false);
      showMessage('add-item-message', '', false);
    });
  }

  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      const section = document.getElementById('add-item-section')?.value;
      const title = document.getElementById('add-item-title')?.value.trim();
      const organization = document.getElementById('add-item-organization')?.value.trim();
      const date = document.getElementById('add-item-date')?.value.trim();
      const description = document.getElementById('add-item-description')?.value.trim();

      if (!section || !title || !organization || !date || !description) {
        showMessage('add-item-message', 'Complete all fields before adding an item.', true);
        return;
      }

      if (!Array.isArray(currentPortfolioData[section])) {
        currentPortfolioData[section] = [];
      }

      currentPortfolioData[section].push({
        title,
        organization,
        date,
        description
      });

      updateCurrentItemsList(currentPortfolioData);
      updatePage(currentPortfolioData);
      showMessage('add-item-message', `Added a new item to ${section}.`, false);

      document.getElementById('add-item-title').value = '';
      document.getElementById('add-item-organization').value = '';
      document.getElementById('add-item-date').value = '';
      document.getElementById('add-item-description').value = '';
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const updatedData = collectAdminData();
      saveData(updatedData);
      currentPortfolioData = updatedData;
      window.portfolioData = updatedData;
      updatePage(updatedData);
      updateCurrentItemsList(updatedData);
      showMessage('save-message', 'Changes saved successfully.', false);
    });
  }
}

initializePortfolio();
initializeAdmin();
