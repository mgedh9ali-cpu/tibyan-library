// 🗂️ قاعدة بيانات الكتب المحاكية
const db = [
  { id: 1, title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=زاد+المعاد", sample: "books/zad_sample.pdf", full: "books/zad_full.pdf" },
  { id: 2, title: "رياض الصالحين", author: "الإمام النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=رياض+الصالحين", sample: "books/riyad_sample.pdf", full: "books/riyad_full.pdf" }
];

let currentAudio = new Audio();
let activeBook = null;

// 🚀 عند التشغيل
window.onload = () => {
  const user = JSON.parse(localStorage.getItem('tibyan_user'));
  if (user) {
    showMainApp(user.name);
  }
};

// 🔐 تسجيل الدخول
function handleGoogleLogin() {
  const name = prompt("أهلاً بك.. أدخل اسمك الكريم للترحيب بك:");
  if (name && name.trim() !== "") {
    localStorage.setItem('tibyan_user', JSON.stringify({ name: name, joined: new Date() }));
    document.getElementById('loginOverlay').classList.add('hidden');
    showWelcomeSplash(name);
  }
}

function showWelcomeSplash(name) {
  const splash = document.getElementById('welcomeSplash');
  document.getElementById('welcomeMessage').innerText = `أهلاً بك يا ${name} في رحاب تبيان.. \n بوابة العلم والتحصيل`;
  splash.classList.remove('hidden');
  
  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.classList.add('hidden');
      showMainApp(name);
    }, 800);
  }, 3000);
}

function showMainApp(name) {
  document.getElementById('loginOverlay').classList.add('hidden');
  document.getElementById('appContent').classList.remove('hidden');
  document.getElementById('meName').innerText = name;
  setRoyalGreeting();
  renderHome();
  loadWard();
}

// 👤 رسائل صفحة "أنا"
function setRoyalGreeting() {
  const quotes = [
    "من قرأ حرفاً، نال به شرفاً.. استمر في رحلتك.",
    "العلم صيدٌ والكتابة قيده.. ماذا ستصطاد اليوم؟",
    "أهلاً بالقارئ النهم، عقلُك اليوم يزداد نوراً وبصيرة."
  ];
  document.getElementById('royalGreeting').innerText = quotes[Math.floor(Math.random() * quotes.length)];
}

// 📱 التنقل
function nav(id, btn) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.getElementById(id).classList.add('active-section');
  btn.classList.add('active');
  if(id === 'me') setRoyalGreeting();
}

// 📖 الورد اليومي
function setWard() {
  const goal = prompt("كم صفحة تنوي قراءتها اليوم؟");
  if(goal) {
    localStorage.setItem('tibyan_ward', JSON.stringify({ goal: parseInt(goal), current: 0 }));
    loadWard();
  }
}

function addProgress() {
  let ward = JSON.parse(localStorage.getItem('tibyan_ward'));
  const pages = prompt("كم صفحة أنجزت الآن؟");
  if(pages) {
    ward.current += parseInt(pages);
    localStorage.setItem('tibyan_ward', JSON.stringify(ward));
    loadWard();
    if(ward.current >= ward.goal) alert("هنيئاً لك! لقد أتممت وردك اليومي 🌟");
  }
}

function loadWard() {
  const ward = JSON.parse(localStorage.getItem('tibyan_ward'));
  if(ward) {
    document.getElementById('wardProgressContainer').classList.remove('hidden');
    document.getElementById('addProgressBtn').classList.remove('hidden');
    document.getElementById('wardText').innerText = "وردك اليومي قيد الإنجاز..";
    document.getElementById('wardProgressText').innerText = `${ward.current} من ${ward.goal} صفحات`;
    const percent = (ward.current / ward.goal) * 100;
    document.getElementById('wardBar').style.width = Math.min(percent, 100) + "%";
  }
}

// 📚 القارئ والأصوات
function renderHome() {
  const grid = document.getElementById('mainGrid');
  grid.innerHTML = db.map(b => `
    <div class="book-card" onclick="openReader(${b.id})" style="background:white; padding:10px; border-radius:15px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      <img src="${b.cover}" style="width:100%; border-radius:10px;">
      <h4 class="royal-font" style="margin:10px 0 0;">${b.title}</h4>
    </div>
  `).join('');
}

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

function selectVoice(v) {
  const voices = { warraq: 'sounds/warraq.mp3', night: 'sounds/night.mp3', researcher: 'sounds/researcher.mp3', friend: 'sounds/friend.mp3' };
  currentAudio.src = voices[v];
  currentAudio.play();
  document.getElementById('playIcon').className = "fas fa-pause";
}

function toggleAudio() {
  if(currentAudio.paused) { currentAudio.play(); document.getElementById('playIcon').className = "fas fa-pause"; }
  else { currentAudio.pause(); document.getElementById('playIcon').className = "fas fa-play"; }
}

function logout() {
  localStorage.removeItem('tibyan_user');
  location.reload();
}
