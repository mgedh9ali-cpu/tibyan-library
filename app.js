// قاعدة بيانات أولية (محلية)
let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
  { title: "زاد المعاد", cover: "https://via.placeholder.com/200x300/3E2723/white?text=Zad", fav: false },
  { title: "رياض الصالحين", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=Riyad", fav: false }
];

// عند تحميل الصفحة
window.onload = () => {
  render(); // عرض الكتب الافتراضية
  render(db.filter(b => b.fav), 'mylistGrid'); // عرض القائمة المفضلة
};

// التنقل بين الصفحات
function nav(id, btn){
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.getElementById(id).classList.add('active-section');
  btn.classList.add('active');
}

// عرض الكتب
function render(data = db, target = 'mainGrid') {
  const grid = document.getElementById(target);
  grid.innerHTML = '';
  data.forEach((book, i) => {
    grid.innerHTML += `
      <div class="book-card">
        <img src="${book.cover}">
        <h4>${book.title}</h4>
        <button onclick="toggleFav(${i})">📌 ${book.fav ? 'إزالة من كتبي' : 'إضافة لكتبي'}</button>
      </div>
    `;
  });
}

// إضافة كتاب جديد من لوحة المالك
function addNewBook() {
  const t = document.getElementById('ownerCode').value;
  if(t) {
    db.push({ title: t, cover: "https://via.placeholder.com/200x300/3E2723/white?text="+t, fav: false });
    localStorage.setItem('tibyan_db', JSON.stringify(db));
    render();
    alert("تم إضافة الكتاب '" + t + "' بنجاح! 🚀");
  } else {
    alert("يرجى إدخال اسم الكتاب أولاً");
  }
}

// المفضلة
function toggleFav(i) {
  db[i].fav = !db[i].fav;
  localStorage.setItem('tibyan_db', JSON.stringify(db));
  render();
  render(db.filter(b => b.fav), 'mylistGrid');
}

// البحث المباشر
function liveSearch() {
  const q = document.getElementById('searchField').value.toLowerCase();
  render(db.filter(b => b.title.toLowerCase().includes(q)));
}

// منطق الرفع والسحب للملفات
function handleDragOver(e) { e.preventDefault(); }
function handleDrop(e, type) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  handleFile(file, type);
}
function handleFile(file, type) {
  if (!file) return;
  const status = document.getElementById(type + 'Status');
  const progress = document.getElementById(type + 'Progress');
  const fill = document.getElementById(type + 'Fill');
  status.innerText = "جاري معالجة: " + file.name;
  progress.style.display = 'block';
  let p = 0;
  const interval = setInterval(() => {
    p += 10;
    fill.style.width = p + '%';
    if (p >= 100) {
      clearInterval(interval);
      status.innerText = "تم تجهيز الملف: " + file.name + " ✅";
    }
  }, 100);
}
function publishBook() {
  const title = document.getElementById('ownerCode').value;
  if(!title) return alert("يرجى إدخال اسم الكتاب أولاً");
  alert("تم إرسال الكتاب '" + title + "' للنشر بنجاح! 🚀");
}

// الوضع الليلي
function toggleDarkMode(){
  document.body.classList.toggle("dark-mode");
}

// ستايل الوضع الليلي
const style = document.createElement('style');
style.innerHTML = `
.dark-mode {
  background: #121212 !important;
  color: #eee !important;
}
.dark-mode .main-header {
  background: linear-gradient(135deg, #000, #333);
}
.dark-mode .nav-bar {
  background: rgba(0,0,0,0.9);
}
`;
document.head.appendChild(style);
