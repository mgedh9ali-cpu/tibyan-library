// قاعدة بيانات الكتب
let db = [
  { id: 1, title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=زاد+المعاد", sample: "books/zad_sample.pdf", full: "books/zad_full.pdf" },
  { id: 2, title: "رياض الصالحين", author: "الإمام النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=رياض+الصالحين", sample: "books/riyad_sample.pdf", full: "books/riyad_full.pdf" }
];

// بيانات المستخدم المحفوظة
let userData = JSON.parse(localStorage.getItem('tibyan_data')) || {
  mylist: [],
  dailyWard: { goal: 0, current: 0, text: "" }
};

let currentAudio = new Audio();

window.onload = () => {
  renderHome();
  loadWard();
  setTimeout(() => document.getElementById('splash').style.display = 'none', 2000);
};

// --- نظام الورد اليومي ---
function setWard() {
  const goal = prompt("كم عدد الصفحات التي تريد قراءتها يومياً؟");
  const bookName = prompt("أي كتاب ستقرأ؟ (اختياري)");
  
  if (goal) {
    userData.dailyWard.goal = parseInt(goal);
    userData.dailyWard.current = 0;
    userData.dailyWard.text = bookName || "كتاب اليوم";
    save();
    loadWard();
  }
}

function addProgress() {
  const pages = prompt("كم صفحة قرأت الآن؟");
  if (pages) {
    userData.dailyWard.current += parseInt(pages);
    if (userData.dailyWard.current >= userData.dailyWard.goal) {
      alert("ما شاء الله! أنجزت وردك اليومي بنجاح 🌟");
    }
    save();
    loadWard();
  }
}

function loadWard() {
  const ward = userData.dailyWard;
  if (ward.goal > 0) {
    document.getElementById('wardText').innerText = `وردك: ${ward.text}`;
    document.getElementById('wardProgressContainer').style.display = 'block';
    document.getElementById('addPagesBtn').style.display = 'inline-block';
    
    const percent = (ward.current / ward.goal) * 100;
    document.getElementById('wardBar').style.width = Math.min(percent, 100) + "%";
    document.getElementById('wardProgressText').innerText = `قرأت ${ward.current} من ${ward.goal} صفحة`;
  }
}

// --- نظام المكتبة والتنقل ---
function renderHome() {
  const grid = document.getElementById('mainGrid');
  grid.innerHTML = db.map(b => `
    <div class="book-card">
      <img src="${b.cover}">
      <h4 class="royal-font">${b.title}</h4>
      <button class="gold-btn-sm" onclick="openReader(${b.id})">قراءة</button>
    </div>
  `).join('');
}

function nav(id, btn) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.getElementById(id).classList.add('active-section');
  btn.classList.add('active');
}

// --- نظام القارئ والأصوات ---
let activeBook = null;
function openReader(id) {
  activeBook = db.find(b => b.id === id);
  document.getElementById('readerTitle').innerText = activeBook.title;
  document.getElementById('bookFrame').src = activeBook.sample;
  document.getElementById('readerOverlay').classList.remove('hidden');
}

function closeReader() {
  document.getElementById('readerOverlay').classList.add('hidden');
  currentAudio.pause();
}

function selectVoice(v) {
  const voices = { warraq: 'sounds/warraq.mp3', night: 'sounds/night.mp3', researcher: 'sounds/researcher.mp3', friend: 'sounds/friend.mp3' };
  currentAudio.src = voices[v];
  currentAudio.play();
}

function toggleAudio() {
  currentAudio.paused ? currentAudio.play() : currentAudio.pause();
}

function save() {
  localStorage.setItem('tibyan_data', JSON.stringify(userData));
}
