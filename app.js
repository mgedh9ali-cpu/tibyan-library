// بيانات الكتب التجريبية
let db = [
  { id: 1, title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=زاد+المعاد", sample: "books/zad_sample.pdf" },
  { id: 2, title: "رياض الصالحين", author: "الإمام النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=رياض+الصالحين", sample: "books/riyad_sample.pdf" }
];

window.onload = () => {
  renderHome();
  // إخفاء الشاشة الافتتاحية
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.style.opacity = '0';
    setTimeout(() => splash.style.display = 'none', 500);
  }, 2500);
};

// التنقل الذكي بين الأقسام
function nav(id, btn) {
  // إزالة الكلاس النشط من جميع الأزرار
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  // إخفاء جميع الأقسام
  document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active-section'));
  
  // تفعيل الزر والقسم المختار
  btn.classList.add('active');
  const target = document.getElementById(id);
  if (target) target.classList.add('active-section');
  
  // تمرير الشاشة للأعلى عند التنقل
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHome() {
  const grid = document.getElementById('mainGrid');
  grid.innerHTML = db.map(b => `
    <div class="book-card" onclick="openReader(${b.id})">
      <img src="${b.cover}" style="width:100%; border-radius:10px;">
      <h4 class="royal-font" style="margin:10px 0 5px; color:var(--gold);">${b.title}</h4>
      <small style="color:#bbb;">${b.author}</small>
    </div>
  `).join('');
}

// فتح القارئ
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

// ميزة الورد اليومي (مبسطة للتخزين)
function setWard() {
  const goal = prompt("حدد هدفك اليومي (عدد الصفحات):");
  if (goal) {
    localStorage.setItem('tibyan_goal', goal);
    document.getElementById('wardText').innerText = `هدفك اليومي: ${goal} صفحة`;
    document.getElementById('wardProgressContainer').style.display = 'block';
  }
}
