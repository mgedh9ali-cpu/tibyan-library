// قاعدة البيانات الموسعة
let db = [
  { id: 1, title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=زاد+المعاد", views: 1500, date: "2023-01-01" },
  { id: 2, title: "رياض الصالحين", author: "النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=رياض+الصالحين", views: 2000, date: "2023-05-01" }
];

// بيانات المستخدم (تخزن في LocalStorage)
let userData = JSON.parse(localStorage.getItem('tibyan_user')) || {
  mylist: [], // مصفوفة كائنات {id, status, notes, fav}
  dailyGoal: 50,
  dailyProgress: 0,
  lastRead: null,
  notes: []
};

window.onload = () => {
  renderHome();
  updateStats();
  updateGoalUI();
  setTimeout(() => document.getElementById('splash').style.display = 'none', 2000);
};

// --- نظام الصفحة الرئيسية ---
function renderHome() {
  renderGrid('mainGrid', db);
  const recent = [...db].sort((a,b) => new Date(b.date) - new Date(a.date));
  renderGrid('recentGrid', recent.slice(0,5));
  const popular = [...db].sort((a,b) => b.views - a.views);
  renderGrid('popularGrid', popular.slice(0,5));
}

// --- نظام المكتبة الشخصية (قائمتي) ---
function filterMylist(status, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  const filteredIds = userData.mylist.filter(item => {
    if(status === 'fav') return item.fav;
    return item.status === status;
  }).map(i => i.id);
  
  const filteredBooks = db.filter(b => filteredIds.includes(b.id));
  renderGrid('mylistGrid', filteredBooks);
}

function updateStats() {
  document.getElementById('statTotal').innerText = userData.mylist.length;
  document.getElementById('statDone').innerText = userData.mylist.filter(i => i.status === 'completed').innerText = userData.mylist.filter(i => i.status === 'completed').length;
  const authors = new Set(db.filter(b => userData.mylist.map(i => i.id).includes(b.id)).map(b => b.author));
  document.getElementById('statAuthors').innerText = authors.size;
  
  // تحديث قائمة المؤلفين
  const authorsList = document.getElementById('authorsList');
  authorsList.innerHTML = Array.from(authors).map(a => `<div class="author-tag">${a}</div>`).join('');
}

// --- الورد اليومي ---
function updateDailyProgress() {
  let pages = prompt("كم صفحة قرأت الآن؟");
  if(pages) {
    userData.dailyProgress += parseInt(pages);
    save();
    updateGoalUI();
  }
}

function updateGoalUI() {
  const percent = (userData.dailyProgress / userData.dailyGoal) * 100;
  document.getElementById('goalBar').style.width = Math.min(percent, 100) + "%";
  document.getElementById('goalText').innerText = `قرأت ${userData.dailyProgress} من ${userData.dailyGoal} صفحة اليوم`;
}

// --- إدارة الملاحظات والنشاط ---
function addNote() {
  let note = prompt("اكتب ملاحظتك أو الاقتباس:");
  if(note) {
    userData.notes.push({ book: activeBook.title, text: note, date: new Date().toLocaleDateString() });
    save();
    renderNotes();
  }
}

function renderNotes() {
  const container = document.getElementById('notesContainer');
  container.innerHTML = userData.notes.map(n => `
    <div class="note-item">
      <strong>${n.book}</strong>: ${n.text} <br> <small>${n.date}</small>
    </div>
  `).join('');
}

// --- الوظائف الأساسية ---
function nav(id, btn) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.getElementById(id).classList.add('active-section');
  btn.classList.add('active');
  if(id === 'mylist') { filterMylist('reading', document.querySelector('.tab-btn')); renderNotes(); }
}

function save() {
  localStorage.setItem('tibyan_user', JSON.stringify(userData));
}

// (تكملة منطق البحث والقارئ كما في النسخ السابقة)
