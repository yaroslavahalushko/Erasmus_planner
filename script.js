const themeToggle = document.getElementById('themeToggle');
const fontSlider = document.getElementById('fontSlider');
const fontValue = document.getElementById('fontValue');
const statusFilter = document.getElementById('statusFilter');
const colorPicker = document.getElementById('colorPicker');
const messageBtn = document.getElementById('messageBtn');
const toggleDocsBtn = document.getElementById('toggleDocsBtn');
const documentsBlock = document.getElementById('documentsBlock');
const announcementText = document.getElementById('announcementText');
const taskList = document.getElementById('taskList');
const taskPreviewList = document.getElementById('taskPreviewList');
const openTaskCount = document.getElementById('openTaskCount');
const docCount = document.getElementById('docCount');
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const profileForm = document.getElementById('profileForm');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileCountry = document.getElementById('profileCountry');
const profileSemester = document.getElementById('profileSemester');
const summaryCountry = document.getElementById('summaryCountry');
const summarySemester = document.getElementById('summarySemester');
const profileStatus = document.getElementById('profileStatus');
const taskForm = document.getElementById('taskForm');
const documentForm = document.getElementById('documentForm');
const documentList = document.getElementById('documentList');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');

const reminderOptions = [
  'Check that your Learning Agreement includes all selected courses before sending it for signatures.',
  'Book accommodation early and save your confirmation in the document section.',
  'Review pending tasks every week so no Erasmus deadline is missed.'
];
let reminderIndex = 0;

function switchAuth(mode) {
  const loginActive = mode === 'login';
  loginForm.classList.toggle('hidden', !loginActive);
  registerForm.classList.toggle('hidden', loginActive);
  showLogin.classList.toggle('active', loginActive);
  showRegister.classList.toggle('active', !loginActive);
}

showLogin?.addEventListener('click', () => switchAuth('login'));
showRegister?.addEventListener('click', () => switchAuth('register'));

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value || 'student@vdu.lt';
  profileEmail.textContent = email;
  profileStatus.textContent = 'Logged in successfully. Your dashboard is ready.';
});

registerForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('registerName').value || 'Guest student';
  const email = document.getElementById('registerEmail').value || 'student@vdu.lt';
  const country = document.getElementById('registerCountry').value || 'Spain';
  profileName.textContent = name;
  profileEmail.textContent = email;
  profileCountry.textContent = country;
  summaryCountry.textContent = country;
  profileStatus.textContent = 'Registration complete. You can now continue with semester planning.';
  switchAuth('login');
});

profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const semesterValue = document.getElementById('profileSemesterInput').value.trim();
  if (semesterValue) {
    profileSemester.textContent = semesterValue;
    summarySemester.textContent = semesterValue;
  }
  profileStatus.textContent = 'Profile changes saved in the prototype view.';
});

function countOpenTasks() {
  const allTasks = [...taskList.querySelectorAll('li')];
  const open = allTasks.filter((item) => item.dataset.status === 'pending').length;
  openTaskCount.textContent = String(open);
}

function syncPreview() {
  const firstThree = [...taskList.querySelectorAll('li')].slice(0, 3);
  taskPreviewList.innerHTML = firstThree.map((item) => {
    const title = item.querySelector('span')?.textContent || 'Task';
    const date = item.querySelector('small')?.textContent || '';
    return `<li><span>${title}</span><small>${date}</small></li>`;
  }).join('');
}

function createTaskElement(title, deadline, status) {
  const li = document.createElement('li');
  li.dataset.status = status;
  if (status === 'completed') li.classList.add('done');
  li.innerHTML = `
    <span>${title}</span>
    <small>${status === 'completed' ? 'Completed' : deadline}</small>
    <div class="task-actions">
      <button type="button" class="small-btn complete-btn">${status === 'completed' ? 'Undo' : 'Complete'}</button>
      <button type="button" class="small-btn danger-btn delete-btn">Delete</button>
    </div>
  `;
  return li;
}

function applyFilter() {
  const value = statusFilter?.value || 'all';
  [...taskList.querySelectorAll('li')].forEach((item) => {
    const match = value === 'all' || item.dataset.status === value;
    item.style.display = match ? 'grid' : 'none';
  });
}

taskForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  const deadline = document.getElementById('taskDeadline').value;
  const status = document.getElementById('taskStatus').value;
  if (!title || !deadline) return;
  taskList.appendChild(createTaskElement(title, deadline, status));
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
    item.querySelector('small').textContent = completed ? 'Updated task' : 'Completed';
    target.textContent = completed ? 'Complete' : 'Undo';
  }

  countOpenTasks();
  syncPreview();
  applyFilter();
});

documentForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('documentTitle').value.trim();
  const fileInput = document.getElementById('documentFile');
  const fileName = fileInput.files[0]?.name || `${title || 'Document'}.pdf`;
  const li = document.createElement('li');
  li.innerHTML = `<strong>${fileName}</strong> <span>${title || 'Added to planner'}</span>`;
  documentList.appendChild(li);
  docCount.textContent = String(documentList.querySelectorAll('li').length);
  documentForm.reset();
});

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
  fontValue.textContent = size;
});

statusFilter?.addEventListener('change', applyFilter);

colorPicker?.addEventListener('input', (event) => {
  document.documentElement.style.setProperty('--accent', event.target.value);
});

messageBtn?.addEventListener('click', () => {
  reminderIndex = (reminderIndex + 1) % reminderOptions.length;
  announcementText.textContent = reminderOptions[reminderIndex];
});

toggleDocsBtn?.addEventListener('click', () => {
  documentsBlock.classList.toggle('hidden');
});

document.querySelectorAll('.gallery-item img').forEach((img) => {
  img.addEventListener('click', () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.showModal();
  });
});

closeLightbox?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

countOpenTasks();
syncPreview();
applyFilter();
