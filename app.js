// قاعدة بيانات الكتب (محفوظة محلياً)
let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
  { title: "مقدمة ابن خلدون", author: "ابن خلدون", cover: "https://via.placeholder.com/200x300/3E2723/white?text=Tibyan", fav: false },
  { title: "تفسير الجلالين", author: "جلال الدين المحلي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=Tibyan", fav: false }
];

// المقتطفات
let quotes = [
  {text: "العلم نور، والقراءة حياة.", author: "ابن القيم", book: "زاد المعاد", likes: 0, comments: [], favorite: false},
  {text: "الحكمة ضالة المؤمن.", author: "النبي ﷺ", book: "رياض الصالحين", likes: 0, comments: [], favorite: false}
];

// التنقل بين الصفحات
function nav(id, btn) {
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
        <div style="display:flex; gap:5px;">
          <button onclick="openAudio('${book.title}')" style="flex:1; background:var(--p); color:white; border:none; padding:8px; border-radius:10px;">🎧 استماع</button>
          <button onclick="toggleFav(${i})" class="fav-btn">
            <i class="${book.fav ? 'fas' : 'far'} fa-star"></i>
          </button>
        </div>
      </div>
    `;
  });
  updateStats();
}

// فتح/إغلاق الصوت
function openAudio(title) {
  alert("تشغيل الكتاب صوتياً: " + title);
}
function closeAudio() {}

// المفضلة
function toggleFav(i) {
  db[i].fav = !db[i].fav;
  localStorage.setItem('tibyan_db', JSON.stringify(db));
  render();
  render(db.filter(b => b.fav), 'mylistGrid');
}

// البحث المتطور
function liveSearch() {
  const q = document.getElementById('mainSearch').value.toLowerCase();
  const results = db.filter(b => b.title.toLowerCase().includes(q) || (b.author && b.author.toLowerCase().includes(q)));
  if(results.length === 0 && q.length > 0) {
    alert("عذراً، لم يتم العثور على الكتاب. يمكنك طلبه عبر بوت المكتبة: @TibyanBooks_bot");
  }
  render(results);
}

// إضافة كتاب جديد
function addNewBook() {
  const t = document.getElementById('bookTitleInput').value;
  if(t) {
    db.push({ title: t, author: "غير معروف", cover: "https://via.placeholder.com/200x300/3E2723/white?text="+t, fav: false });
    localStorage.setItem('tibyan_db', JSON.stringify(db));
    render();
  }
}

// إحصائيات القراءة
function updateStats() {
  const stats = document.getElementById('stats');
  stats.innerHTML = `
    <p>📚 عدد الكتب: ${db.length}</p>
    <p>⭐ عدد المفضلة: ${db.filter(b => b.fav).length}</p>
  `;
}

// المقتطفات (عرض كـ بوستات)
function renderQuotes(list = quotes) {
  const feed = document.getElementById("quotesFeed");
  feed.innerHTML = "";
  list.forEach((q, index) => {
    feed.innerHTML += `
      <div class="quote-card">
        <p>"${q.text}"</p>
        <p>👤 ${q.author}</p>
        <p>📖 ${q.book}</p>
        <div class="actions">
          <button onclick="likeQuote(${index})">❤️ إعجاب (${q.likes})</button>
          <button onclick="toggleComments(${index})">💬 تعليقات (${q.comments.length})</button>
          <button onclick="toggleFavorite(${index})">⭐ ${q.favorite ? 'مفضلة' : 'أضف للمفضلة'}</button>
        </div>
        <div id="comments-${index}" style="display:none; margin-top:10px;">
          <input type="text" id="commentInput-${index}" placeholder="أضف تعليق...">
          <button onclick="addComment(${index})">➕</button>
          <div id="commentList-${index}"></div>
        </div>
      </div>
    `;
  });
}

// إعجاب وتعليقات ومفضلة للمقتطفات
function likeQuote(i) { quotes[i].likes++; renderQuotes(); }
function toggleComments(i) {
  const div = document.getElementById("comments-"+i);
  div.style.display = div.style.display === "none" ? "block" : "none";
  renderComments(i);
}
function addComment(i) {
  const input = document.getElementById("commentInput-"+i);
  if(input.value.trim() !== "") {
    quotes[i].comments.push(input.value.trim());
    input.value = "";
    renderComments(i);
    renderQuotes();
  }
}
function renderComments(i) {
  const listDiv = document.getElementById("commentList-"+i);
  listDiv.innerHTML = "";
  quotes[i].comments.forEach(c => {
    listDiv.innerHTML += `<p>💬 ${c}</p>`;
  });
}
function toggleFavorite(i) { quotes[i].favorite = !quotes[i].favorite; renderQuotes(); }

// فرز المقتطفات
function filterQuotes() {
  const bookName = document.getElementById("filterBook").value.toLowerCase();
  const authorName = document.getElementById("filterAuthor").value.toLowerCase();
  const filtered = quotes.filter(q => q.book.toLowerCase().includes(bookName) && q.author.toLowerCase().includes(authorName));
  renderQuotes(filtered);
}
function showAllQuotes() { renderQuotes(quotes); }
function sortByLikes() { renderQuotes([...quotes].sort((a,b)=>b.likes-a.likes)); }
function sortByComments() { renderQuotes([...quotes].sort((a,b)=>b.comments.length-a.comments.length)); }
function showFavorites() { renderQuotes(quotes.filter(q=>q.favorite)); }

// ورد يومي
function setDaily(book, fromPage, toPage) {
  const box = document.getElementById("dailyBox");
  box.innerHTML = `<p>📖 وردك اليومي: ${book} من صفحة ${fromPage} إلى صفحة ${toPage}</p>`;
}

// الإعدادات
function toggleDarkMode() { document.body.classList.toggle("dark-mode"); }
function changeFont(style) {
  document.body.classList.remove("arabic-font","modern-font","hand-font");
  if(style==="arabic") document.body.classList.add("arabic-font");
  if(style==="modern") document.body.classList.add("modern-font");
  if(style==="hand") document.body.classList.add("hand-font");
}
function increaseFont() {
  document.body.style.fontSize = (parseInt(window.getComputedStyle(document.body).fontSize)+2)+"px";
}
function decreaseFont() {
  document.body.style.fontSize = (parseInt(window.getComputedStyle(document.body).fontSize)-2)+"px";
}

// تشغيل أولي
window.onload = () => {
  render();
  render(db.filter(b => b.fav), 'mylistGrid');
  renderQuotes();
};
