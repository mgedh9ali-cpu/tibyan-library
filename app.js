// قاعدة البيانات المدمجة
let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
  { id:1, title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=زاد+المعاد", sample: "books/zad_sample.pdf", full: "books/zad_full.pdf", status: "reading" },
  { id:2, title: "رياض الصالحين", author: "النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=رياض+الصالحين", sample: "books/riyad_sample.pdf", full: "books/riyad_full.pdf", status: "none" }
];

let currentAudio = new Audio();
currentAudio.loop = true;

const voices = {
  warraq: 'sounds/warraq.mp3',
  night: 'sounds/night.mp3',
  researcher: 'sounds/researcher.mp3',
  friend: 'sounds/friend.mp3'
};

// تشغيل عند البدء
window.onload = () => {
  refreshHome();
  setTimeout(() => document.getElementById('splash').style.display = 'none', 2500);
};

// التنقل بين الصفحات
function nav(id, btn) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.getElementById(id).classList.add('active-section');
  btn.classList.add('active');
  if(id === 'mylist') renderMylist();
}

// عرض الكتب
function refreshHome() {
  renderGrid('mainGrid', db);
  renderGrid('recentGrid', db.slice(0,2));
  renderGrid('popularGrid', db.slice(0,2));
}

function renderGrid(targetId, data) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  grid.innerHTML = data.map(b => `
    <div class="book-card">
      <img src="${b.cover}">
      <h4 class="royal-font">${b.title}</h4>
      <button class="gold-btn" onclick="openReader(${b.id})">قراءة</button>
    </div>
  `).join('');
}

// نظام القارئ
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
  document.getElementById('bookFrame').src = "";
}

function playSample() { document.getElementById('bookFrame').src = activeBook.sample; }
function playFull() { document.getElementById('bookFrame').src = activeBook.full; }

// نظام الصوت (رفقاء القراءة)
function selectVoice(v) {
  currentAudio.src = voices[v];
  currentAudio.play();
  document.getElementById('playIcon').innerHTML = '<i class="fas fa-pause"></i>';
}

function toggleAudio() {
  if (currentAudio.paused) {
    currentAudio.play();
    document.getElementById('playIcon').innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    currentAudio.pause();
    document.getElementById('playIcon').innerHTML = '<i class="fas fa-play"></i>';
  }
}

function setVolume(v) { currentAudio.volume = v; }

// التلخيص
function textSummary() {
  alert("ملخص ورقي: هذا الكتاب يتناول جوهر العلوم بأسلوب رصين يجمع بين التراث والحداثة.");
}

function audioSummary() {
  if(!document.getElementById('audioSummaryToggle').checked) return;
  let msg = new SpeechSynthesisUtterance("أهلاً بك في ملخص تبيان الصوتي. هذا الكتاب يعد مرجعاً أساسياً في بابه.");
  msg.lang = 'ar';
  window.speechSynthesis.speak(msg);
}

// البحث والكلمة السرية
function liveSearch() {
  let q = document.getElementById('searchField').value.toLowerCase();
  if (q === 'heizoum') {
    document.getElementById('ownerNavBtn').style.display = 'flex';
    return;
  }
  let filtered = db.filter(b => b.title.toLowerCase().includes(q));
  renderGrid('mainGrid', filtered);
}
