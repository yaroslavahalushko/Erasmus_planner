const navToggle = document.querySelector('[data-menu-toggle]');
const navList = document.querySelector('[data-nav-list]');
navToggle?.addEventListener('click', () => navList?.classList.toggle('open'));

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

const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileCountry = document.getElementById('profileCountry');
const profileSemester = document.getElementById('profileSemester');
const summaryCountry = document.getElementById('summaryCountry');
const summarySemester = document.getElementById('summarySemester');
const profileForm = document.getElementById('profileForm');
const profileStatus = document.getElementById('profileStatus');

function saveProfileToStorage(profile) {
  localStorage.setItem('erasmus-profile', JSON.stringify(profile));
}

function loadProfileFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('erasmus-profile') || '{}');
  } catch {
    return {};
  }
}

function applyProfile(profile) {
  if (profile.name && profileName) profileName.textContent = profile.name;
  if (profile.email && profileEmail) profileEmail.textContent = profile.email;
  if (profile.country && profileCountry) profileCountry.textContent = profile.country;
  if (profile.semester && profileSemester) profileSemester.textContent = profile.semester;
  if (profile.country && summaryCountry) summaryCountry.textContent = profile.country;
  if (profile.semester && summarySemester) summarySemester.textContent = profile.semester;
}

const storedProfile = loadProfileFromStorage();
applyProfile(storedProfile);

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) return;
  const current = loadProfileFromStorage();
  const fallbackName = email.split('@')[0].replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const profile = {
    name: current.name || fallbackName,
    email,
    country: current.country || 'Spain',
    semester: current.semester || 'Fall 2026',
  };
  saveProfileToStorage(profile);
  applyProfile(profile);
  if (authStatus) authStatus.textContent = `Welcome back, ${profile.name}. The dashboard is ready below.`;
  document.getElementById('dashboardArea')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

registerForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const profile = {
    name: document.getElementById('registerName').value.trim(),
    email: document.getElementById('registerEmail').value.trim(),
    country: document.getElementById('registerCountry').value.trim(),
    semester: document.getElementById('registerSemester').value.trim(),
  };
  saveProfileToStorage(profile);
  applyProfile(profile);
  if (authStatus) authStatus.textContent = `Student profile created for ${profile.name}. You can now continue planning the semester.`;
  activateTab('login');
});

profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const current = loadProfileFromStorage();
  const updated = {
    name: current.name || profileName?.textContent || 'Student',
    email: current.email || profileEmail?.textContent || 'student@vdu.lt',
    country: document.getElementById('profileCountryInput').value.trim() || current.country || profileCountry?.textContent,
    semester: document.getElementById('profileSemesterInput').value.trim() || current.semester || profileSemester?.textContent,
  };
  saveProfileToStorage(updated);
  applyProfile(updated);
  if (profileStatus) profileStatus.textContent = 'Profile information updated successfully.';
  profileForm.reset();
});

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const taskPreviewList = document.getElementById('taskPreviewList');
const openTaskCount = document.getElementById('openTaskCount');
const statusFilter = document.getElementById('statusFilter');
const reminderOptions = [
  'Remember to confirm the final course list before the Learning Agreement is signed.',
  'Accommodation search should start early because popular student housing fills quickly.',
  'Check whether insurance coverage dates match your whole mobility period.',
];
let reminderIndex = 0;

function countOpenTasks() {
  if (!taskList || !openTaskCount) return;
  const openTasks = [...taskList.querySelectorAll('li')].filter((item) => item.dataset.status === 'pending').length;
  openTaskCount.textContent = String(openTasks);
}

function syncPreview() {
  if (!taskList || !taskPreviewList) return;
  const firstThree = [...taskList.querySelectorAll('li')].slice(0, 3);
  taskPreviewList.innerHTML = firstThree.map((item) => {
    const title = item.querySelector('.task-title')?.textContent || 'Task';
    const date = item.querySelector('.task-meta')?.textContent || '';
    return `<li><div class="task-row"><div><div class="task-title">${title}</div><div class="task-meta">${date}</div></div></div></li>`;
  }).join('');
}

function createTaskElement(title, deadline, status) {
  const li = document.createElement('li');
  li.dataset.status = status;
  if (status === 'completed') li.classList.add('done');
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
  const title = document.getElementById('taskTitle').value.trim();
  const deadline = document.getElementById('taskDeadline').value;
  const status = document.getElementById('taskStatus').value;
  if (!title || !deadline) return;
  taskList?.appendChild(createTaskElement(title, deadline, status));
  taskForm.reset();
  countOpenTasks();
  syncPreview();
  applyFilter();
});

taskList?.addEventListener('click', (event) => {
  const target = event.target;
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
    if (meta) meta.textContent = completed ? 'Updated task' : 'Completed';
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
  const title = document.getElementById('documentTitle').value.trim();
  const fileInput = document.getElementById('documentFile');
  const fileName = fileInput.files[0]?.name || `${title || 'document'}.pdf`;
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
  if (docCount && documentList) docCount.textContent = String(documentList.querySelectorAll('li').length);
  documentForm.reset();
});

const themeToggle = document.getElementById('themeToggle');
const fontSlider = document.getElementById('fontSlider');
const fontValue = document.getElementById('fontValue');
const colorPicker = document.getElementById('colorPicker');
const messageBtn = document.getElementById('messageBtn');
const announcementText = document.getElementById('announcementText');
const toggleDocsBtn = document.getElementById('toggleDocsBtn');
const documentsBlock = document.getElementById('documentsBlock');

const savedTheme = localStorage.getItem('erasmus-theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  if (themeToggle) themeToggle.checked = true;
}

themeToggle?.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('erasmus-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

fontSlider?.addEventListener('input', (event) => {
  const size = `${event.target.value}px`;
  document.documentElement.style.setProperty('--base-font', size);
  if (fontValue) fontValue.textContent = size;
});

statusFilter?.addEventListener('change', applyFilter);

colorPicker?.addEventListener('input', (event) => {
  document.documentElement.style.setProperty('--accent', event.target.value);
});

messageBtn?.addEventListener('click', () => {
  reminderIndex = (reminderIndex + 1) % reminderOptions.length;
  if (announcementText) announcementText.textContent = reminderOptions[reminderIndex];
});

toggleDocsBtn?.addEventListener('click', () => {
  documentsBlock?.classList.toggle('hidden');
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');

document.querySelectorAll('[data-lightbox-item] img').forEach((img) => {
  img.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.showModal();
  });
});

closeLightbox?.addEventListener('click', () => lightbox?.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

countOpenTasks();
syncPreview();
applyFilter();
