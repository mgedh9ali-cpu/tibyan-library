const db = [
  { id: 1, title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=زاد+المعاد", sample: "books/zad_sample.pdf" },
  { id: 2, title: "رياض الصالحين", author: "الإمام النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=رياض+الصالحين", sample: "books/riyad_sample.pdf" }
];

let currentAudio = new Audio();

window.onload = () => {
  renderHome();
  setRoyalGreeting();
  // إخفاء شاشة البداية تلقائياً بعد ثانيتين
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if(splash) splash.style.display = 'none';
  }, 2000);
};

// التنقل بين الأزرار
function nav(id, btn) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.getElementById(id).classList.add('active-section');
  btn.classList.add('active');
}

function renderHome() {
  const grid = document.getElementById('mainGrid');
  grid.innerHTML = db.map(b => `
    <div class="book-card" onclick="openReader(${b.id})" style="background:white; padding:10px; border-radius:15px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      <img src="${b.cover}" style="width:100%; border-radius:10px;">
      <h4 class="royal-font">${b.title}</h4>
    </div>
  `).join('');
}

function setRoyalGreeting() {
  const quotes = ["العلم صيدٌ والكتابة قيده..", "القراءة هي السفر عبر العصور..", "خير جليس في الأنام كتاب.."];
  document.getElementById('royalGreeting').innerText = quotes[Math.floor(Math.random() * quotes.length)];
}

function openReader(id) {
  const book = db.find(b => b.id === id);
  document.getElementById('readerTitle').innerText = book.title;
  document.getElementById('bookFrame').src = book.sample;
  document.getElementById('readerOverlay').classList.remove('hidden');
}

function closeReader() {
  document.getElementById('readerOverlay').classList.add('hidden');
  document.getElementById('bookFrame').src = "";
}
