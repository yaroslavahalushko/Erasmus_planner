const themeToggle = document.getElementById('themeToggle');
const fontSlider = document.getElementById('fontSlider');
const fontValue = document.getElementById('fontValue');
const statusFilter = document.getElementById('statusFilter');
const colorPicker = document.getElementById('colorPicker');
const messageBtn = document.getElementById('messageBtn');
const toggleDocsBtn = document.getElementById('toggleDocsBtn');
const documentsBlock = document.getElementById('documentsBlock');
const announcementText = document.getElementById('announcementText');
const taskListItems = document.querySelectorAll('#taskList li');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');
const taskCount = document.getElementById('taskCount');

const announcementOptions = [
  'Start collecting signatures for your Learning Agreement early so you do not delay the approval process.',
  'Check accommodation options early and save confirmations together with your travel documents.',
  'Review your pending tasks every week so you can solve missing documents before the deadline.'
];
let messageIndex = 0;

const savedTheme = localStorage.getItem('erasmus-theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.checked = true;
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

statusFilter?.addEventListener('change', (event) => {
  let visibleCount = 0;
  taskListItems.forEach((item) => {
    const match = event.target.value === 'all' || item.dataset.status === event.target.value;
    item.style.display = match ? 'list-item' : 'none';
    if (match && item.dataset.status === 'pending') visibleCount += 1;
  });
  taskCount.textContent = event.target.value === 'completed' ? '2' : event.target.value === 'pending' ? String(visibleCount) : '5';
});

colorPicker?.addEventListener('input', (event) => {
  document.documentElement.style.setProperty('--accent', event.target.value);
});

messageBtn?.addEventListener('click', () => {
  messageIndex = (messageIndex + 1) % announcementOptions.length;
  announcementText.textContent = announcementOptions[messageIndex];
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
