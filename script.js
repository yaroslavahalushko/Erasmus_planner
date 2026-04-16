const navToggle = document.querySelector('[data-menu-toggle]');
const navList = document.querySelector('[data-nav-list]');

navToggle?.addEventListener('click', () => {
  navList?.classList.toggle('open');
});

const loginKey = 'erasmus-authenticated';
const profileKey = 'erasmus-profile';
const themeKey = 'erasmus-theme';
const fontKey = 'erasmus-font-size';
const accentKey = 'erasmus-accent';

function saveProfile(profile) {
  localStorage.setItem(profileKey, JSON.stringify(profile));
}

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(profileKey) || '{}');
  } catch {
    return {};
  }
}

function isAuthenticated() {
  return localStorage.getItem(loginKey) === 'true';
}

function requireAuthForPage() {
  const needsAuth = document.body.dataset.requiresAuth === 'true';
  if (needsAuth && !isAuthenticated()) {
    window.location.href = 'index.html';
  }
}

requireAuthForPage();

document.querySelectorAll('[data-logout]').forEach((button) => {
  button.addEventListener('click', () => {
    localStorage.removeItem(loginKey);
    window.location.href = 'index.html';
  });
});

const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authStatus = document.getElementById('authStatus');

function activateTab(mode) {
  if (!showLogin || !showRegister || !loginForm || !registerForm) return;

  const loginActive = mode === 'login';
  showLogin.classList.toggle('active', loginActive);
  showRegister.classList.toggle('active', !loginActive);
  loginForm.classList.toggle('hidden', !loginActive);
  registerForm.classList.toggle('hidden', loginActive);
}

showLogin?.addEventListener('click', () => activateTab('login'));
showRegister?.addEventListener('click', () => activateTab('register'));

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('loginEmail')?.value.trim();
  if (!email) return;

  const current = loadProfile();
  const fallbackName = email
    .split('@')[0]
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const profile = {
    name: current.name || fallbackName,
    email,
    country: current.country || 'Spain',
    semester: current.semester || 'Fall 2026',
    notes: current.notes || 'Need host university course approval and accommodation search.',
  };

  saveProfile(profile);
  localStorage.setItem(loginKey, 'true');

  if (authStatus) {
    authStatus.textContent = `Welcome back, ${profile.name}. Redirecting to your planner...`;
  }

  setTimeout(() => {
    window.location.href = 'home.html';
  }, 500);
});

registerForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const profile = {
    name: document.getElementById('registerName')?.value.trim() || 'Student',
    email: document.getElementById('registerEmail')?.value.trim() || 'student@vdu.lt',
    country: document.getElementById('registerCountry')?.value.trim() || 'Spain',
    semester: document.getElementById('registerSemester')?.value.trim() || 'Fall 2026',
    notes: 'Profile created. Add your semester notes on the profile page.',
  };

  saveProfile(profile);
  localStorage.setItem(loginKey, 'true');

  if (authStatus) {
    authStatus.textContent = `Account created for ${profile.name}. Redirecting to the website...`;
  }

  setTimeout(() => {
    window.location.href = 'home.html';
  }, 500);
});

const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileCountry = document.getElementById('profileCountry');
const profileSemester = document.getElementById('profileSemester');
const profileNotesPreview = document.getElementById('profileNotesPreview');
const summaryCountry = document.getElementById('summaryCountry');
const summarySemester = document.getElementById('summarySemester');
const summaryName = document.getElementById('summaryName');
const profileForm = document.getElementById('profileForm');
const profileStatus = document.getElementById('profileStatus');

function applyProfile(profile) {
  if (profile.name && profileName) profileName.textContent = profile.name;
  if (profile.email && profileEmail) profileEmail.textContent = profile.email;
  if (profile.country && profileCountry) profileCountry.textContent = profile.country;
  if (profile.semester && profileSemester) profileSemester.textContent = profile.semester;
  if (profile.country && summaryCountry) summaryCountry.textContent = profile.country;
  if (profile.semester && summarySemester) summarySemester.textContent = profile.semester;
  if (profile.name && summaryName) summaryName.textContent = profile.name;
  if (profile.notes && profileNotesPreview) profileNotesPreview.textContent = profile.notes;
}

applyProfile(loadProfile());

profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const current = loadProfile();
  const updated = {
    name: document.getElementById('profileNameInput')?.value.trim() || current.name || 'Student',
    email: document.getElementById('profileEmailInput')?.value.trim() || current.email || 'student@vdu.lt',
    country: document.getElementById('profileCountryInput')?.value.trim() || current.country || 'Spain',
    semester: document.getElementById('profileSemesterInput')?.value.trim() || current.semester || 'Fall 2026',
    notes: document.getElementById('profileNotes')?.value.trim() || current.notes || 'Need host university course approval and accommodation search.',
  };

  saveProfile(updated);
  applyProfile(updated);

  if (profileStatus) {
    profileStatus.textContent = 'Profile information updated successfully.';
  }

  profileForm.reset();
});

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const taskPreviewList = document.getElementById('taskPreviewList');
const openTaskCount = document.getElementById('openTaskCount');
const statusFilter = document.getElementById('statusFilter');

function countOpenTasks() {
  if (!taskList || !openTaskCount) return;

  const openTasks = [...taskList.querySelectorAll('li')].filter(
    (item) => item.dataset.status === 'pending'
  ).length;

  openTaskCount.textContent = String(openTasks);
}

function syncPreview() {
  if (!taskList || !taskPreviewList) return;

  const firstThree = [...taskList.querySelectorAll('li')].slice(0, 3);

  taskPreviewList.innerHTML = firstThree
    .map((item) => {
      const title = item.querySelector('.task-title')?.textContent || 'Task';
      const date = item.querySelector('.task-meta')?.textContent || '';
      return `
        <li>
          <div class="task-row">
            <div>
              <div class="task-title">${title}</div>
              <div class="task-meta">${date}</div>
            </div>
          </div>
        </li>
      `;
    })
    .join('');
}

function createTaskElement(title, deadline, status) {
  const li = document.createElement('li');
  li.dataset.status = status;

  if (status === 'completed') {
    li.classList.add('done');
  }

  li.innerHTML = `
    <div class="task-row">
      <div>
        <div class="task-title">${title}</div>
        <div class="task-meta">${status === 'completed' ? 'Completed' : deadline}</div>
      </div>
      <div class="task-actions">
        <button type="button" class="small-btn complete-btn">${status === 'completed' ? 'Undo' : 'Complete'}</button>
        <button type="button" class="small-btn danger delete-btn">Delete</button>
      </div>
    </div>
  `;

  return li;
}

function applyFilter() {
  if (!taskList || !statusFilter) return;

  const value = statusFilter.value;

  [...taskList.querySelectorAll('li')].forEach((item) => {
    const match = value === 'all' || item.dataset.status === value;
    item.style.display = match ? 'block' : 'none';
  });
}

taskForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('taskTitle')?.value.trim();
  const deadline = document.getElementById('taskDeadline')?.value;
  const status = document.getElementById('taskStatus')?.value || 'pending';

  if (!title || !deadline) return;

  taskList?.appendChild(createTaskElement(title, deadline, status));
  taskForm.reset();

  countOpenTasks();
  syncPreview();
  applyFilter();
});

taskList?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const item = target.closest('li');
  if (!item) return;

  if (target.classList.contains('delete-btn')) {
    item.remove();
  }

  if (target.classList.contains('complete-btn')) {
    const completed = item.dataset.status === 'completed';
    item.dataset.status = completed ? 'pending' : 'completed';
    item.classList.toggle('done', !completed);

    const meta = item.querySelector('.task-meta');
    if (meta) {
      meta.textContent = completed ? 'Updated task' : 'Completed';
    }

    target.textContent = completed ? 'Complete' : 'Undo';
  }

  countOpenTasks();
  syncPreview();
  applyFilter();
});

const documentForm = document.getElementById('documentForm');
const documentList = document.getElementById('documentList');
const docCount = document.getElementById('docCount');

documentForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('documentTitle')?.value.trim();
  const fileInput = document.getElementById('documentFile');
  const fileName = fileInput?.files?.[0]?.name || `${title || 'document'}.pdf`;

  const li = document.createElement('li');
  li.innerHTML = `
    <div class="doc-row">
      <div>
        <strong>${fileName}</strong>
        <div class="doc-meta">${title || 'Added to planner'}</div>
      </div>
    </div>
  `;

  documentList?.appendChild(li);

  if (docCount && documentList) {
    docCount.textContent = String(documentList.querySelectorAll('li').length);
  }

  documentForm.reset();
});

function deleteNote(button) {
  const noteItem = button.parentElement;
  noteItem?.remove();
}

function addNote() {
  const input = document.getElementById('newNoteInput');
  const notesList = document.getElementById('notesList');
  const text = input?.value.trim();

  if (!text || !notesList) return;

  const noteItem = document.createElement('div');
  noteItem.className = 'note-item';

  noteItem.innerHTML = `
    <span>${text}</span>
    <button class="note-delete" onclick="deleteNote(this)">Delete</button>
  `;

  notesList.appendChild(noteItem);
  input.value = '';
}

function changeReminder() {
  const reminders = [
    'Upload your Learning Agreement before the faculty deadline.',
    'Check if your passport and insurance are valid for the full semester.',
    'Review the course list before submitting the final plan.',
    'Confirm accommodation and save all booking details in your planner.'
  ];

  const current = localStorage.getItem('dashboardReminder') || reminders[0];
  let nextIndex = reminders.indexOf(current) + 1;

  if (nextIndex >= reminders.length) {
    nextIndex = 0;
  }

  localStorage.setItem('dashboardReminder', reminders[nextIndex]);

  const reminderBox = document.getElementById('latestReminder');
  if (reminderBox) {
    reminderBox.textContent = reminders[nextIndex];
  }
}

function togglePlannerDocuments() {
  const current = localStorage.getItem('plannerDocumentsVisible');
  const newValue = current === 'hidden' ? 'shown' : 'hidden';

  localStorage.setItem('plannerDocumentsVisible', newValue);

  const docsBlock = document.getElementById('plannerDocuments');
  if (docsBlock) {
    docsBlock.style.display = newValue === 'hidden' ? 'none' : 'block';
  }
}

function applyPlannerSettings() {
  const savedReminder = localStorage.getItem('dashboardReminder');
  const docsVisibility = localStorage.getItem('plannerDocumentsVisible');

  const reminderBox = document.getElementById('latestReminder');
  if (reminderBox && savedReminder) {
    reminderBox.textContent = savedReminder;
  }

  const docsBlock = document.getElementById('plannerDocuments');
  if (docsBlock) {
    docsBlock.style.display = docsVisibility === 'hidden' ? 'none' : 'block';
  }
}

const themeToggle = document.getElementById('themeToggle');
const fontSlider = document.getElementById('fontSlider');
const fontValue = document.getElementById('fontValue');
const colorPicker = document.getElementById('colorPicker');

const savedTheme = localStorage.getItem(themeKey);
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  if (themeToggle) themeToggle.checked = false;
}

const savedFontSize = localStorage.getItem(fontKey);
if (savedFontSize) {
  document.documentElement.style.setProperty('--base-font', savedFontSize);
  if (fontSlider) fontSlider.value = parseInt(savedFontSize, 10);
  if (fontValue) fontValue.textContent = savedFontSize;
}

const savedAccent = localStorage.getItem(accentKey);
if (savedAccent) {
  document.documentElement.style.setProperty('--accent', savedAccent);
  if (colorPicker) colorPicker.value = savedAccent;
}

themeToggle?.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem(themeKey, document.body.classList.contains('dark') ? 'dark' : 'light');
});

fontSlider?.addEventListener('input', (event) => {
  const size = `${event.target.value}px`;
  document.documentElement.style.setProperty('--base-font', size);
  localStorage.setItem(fontKey, size);
  if (fontValue) fontValue.textContent = size;
});

statusFilter?.addEventListener('change', applyFilter);

colorPicker?.addEventListener('input', (event) => {
  document.documentElement.style.setProperty('--accent', event.target.value);
  localStorage.setItem(accentKey, event.target.value);
});

countOpenTasks();
syncPreview();
applyFilter();
applyPlannerSettings();

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');

document.querySelectorAll('[data-lightbox-item]').forEach((item) => {
  item.addEventListener('click', () => {
    const image = item.querySelector('img');
    if (!image || !lightbox || !lightboxImage) return;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  });
});

closeLightbox?.addEventListener('click', () => lightbox?.close());

lightbox?.addEventListener('click', (event) => {
  const rect = lightbox.getBoundingClientRect();
  const inDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;

  if (!inDialog) {
    lightbox.close();
  }
});
