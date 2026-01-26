// قاعدة بيانات أولية (تخزين محلي)
let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
  { title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=Zad", fav: false, status: "reading" },
  { title: "رياض الصالحين", author: "النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=Riyad", fav: false, status: "completed" }
];

// عند تحميل الصفحة
window.onload = () => {
  render();
  renderLists();
  renderAuthors();
  updateStats();
};

// إخفاء شاشة البداية بعد 3 ثواني
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
  }, 3000);
});

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
        <img src="${book.cover}" alt="${book.title}">
        <h4>${book.title}</h4>
        <p>${book.author}</p>
        <button onclick="toggleFav(${i})">${book.fav ? '💖' : '📌'}</button>
      </div>
    `;
  });
}

// البحث المباشر
function liveSearch(){
  const q = document.getElementById('searchField').value.toLowerCase();
  const results = db.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  render(results);
}

// تبديل المفضلة
function toggleFav(i){
  db[i].fav = !db[i].fav;
  saveDB();
  render();
  renderLists();
  updateStats();
}

// حفظ قاعدة البيانات
function saveDB(){
  localStorage.setItem('tibyan_db', JSON.stringify(db));
}

// ورد يومي
function setWard() {
  const ward = prompt("ما هو وردك اليومي؟ (مثال: 10 صفحات من رياض الصالحين)");
  if(ward) {
    document.getElementById('wardText').innerText = "وردك اليومي: " + ward;
  }
}

// عرض المؤلفين
function renderAuthors() {
  const authors = [...new Set(db.map(b => b.author).filter(a => a))];
  const list = document.getElementById('authorList');
  list.innerHTML = '';
  authors.forEach(a => {
    list.innerHTML += `<li onclick="showAuthorBooks('${a}')">${a}</li>`;
  });
}
function showAuthorBooks(author) {
  alert("كتب المؤلف " + author + ":\n" + db.filter(b => b.author === author).map(b => b.title).join(", "));
}

// تقسيم الكتب حسب الحالة
function renderLists() {
  render(db.filter(b => b.status === 'reading'), 'readingGrid');
  render(db.filter(b => b.status === 'completed'), 'completedGrid');
  render(db.filter(b => b.fav), 'favGrid');
}

// تحديث إحصائيات صفحة "أنا"
function updateStats(){
  document.getElementById('statMyList').innerText = db.length;
  document.getElementById('statCompleted').innerText = db.filter(b => b.status === 'completed').length;
  document.getElementById('statReading').innerText = db.filter(b => b.status === 'reading').length;
}

// الوضع الليلي
function toggleDarkMode(){
  document.body.classList.toggle("dark-mode");
}
function changeTheme(){
  alert("ميزة تغيير الألوان قيد التطوير 👑");
}
function changeFontSize(){
  document.body.style.fontSize = "18px";
}

// إدارة قائمتي
function manageMyList(){
  alert("ميزة إدارة قائمتي قيد التطوير 👑");
}
function manageAuthors(){
  alert("ميزة إدارة المؤلفين المفضلين قيد التطوير 👑");
}

// رفع الملفات (لوحة المالك)
function handleFile(file, type){
  if(file){
    if(type === 'cover'){
      document.getElementById('coverStatus').innerText = "تم اختيار الغلاف: " + file.name;
    } else {
      document.getElementById('fileStatus').innerText = "تم اختيار الملف: " + file.name;
    }
  }
}
function handleDrop(e, type){
  e.preventDefault();
  handleFile(e.dataTransfer.files[0], type);
}
function handleDragOver(e){
  e.preventDefault();
}
function publishBook(){
  const title = document.getElementById('ownerCode').value;
  if(title){
    db.push({title, author:"غير معروف", cover:"https://via.placeholder.com/200x300/D4AF37/white?text="+title, fav:false, status:"reading"});
    saveDB();
    render();
    renderLists();
    renderAuthors();
    updateStats();
    alert("تم نشر الكتاب بنجاح 🚀");
  }
}
