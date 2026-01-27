// بيانات تجريبية ابتدائية (يمكن تعديلها لاحقاً)
let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
  { id:1, title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=زاد+المعاد", fav: true, status: "reading", views: 240, date: "2026-01-20" },
  { id:2, title: "رياض الصالحين", author: "النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=رياض+الصالحين", fav: false, status: "completed", views: 410, date: "2026-01-25" }
];

// تشغيل عند تحميل الصفحة
window.onload = () => {
  try {
    refreshHome();
    updateStats();
    // إخفاء شاشة البداية بعد 2.5-4 ثواني (يعتمد وجود الفيديو)
    setTimeout(() => {
      const splash = document.getElementById("splash");
      if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => { splash.style.display = "none"; }, 800);
      }
    }, 2500);
  } catch (e) {
    console.error(e);
  }
};

// تابع البحث + الكلمة السرية "heizoum"
function liveSearch() {
  const input = document.getElementById('searchField');
  if (!input) return;
  const q = input.value.trim().toLowerCase();

  // مفتاح سري: heizoum لاظهار/اخفاء زر المالك
  if (q === 'heizoum') {
    const btn = document.getElementById('ownerNavBtn');
    if (btn) {
      btn.style.display = (btn.style.display === 'none' || btn.style.display === '') ? 'flex' : 'none';
      alert(btn.style.display === 'flex' ? "أهلاً بك يا كحيلان 🛡️" : "تم إخفاء لوحة المالك 🔒");
    }
    input.value = '';
    refreshHome();
    return;
  }

  // بحث عادي في العناوين والمؤلفين
  if (q.length === 0) {
    refreshHome();
    return;
  }
  const filtered = db.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  renderGrid('mainGrid', filtered);
}

// عرض الصفحة الرئيسية: أحدث + شائع + الكل
function refreshHome() {
  const recent = [...db].sort((a,b) => new Date(b.date) - new Date(a.date));
  renderGrid('recentGrid', recent.slice(0,5));
  const popular = [...db].sort((a,b) => (b.views||0) - (a.views||0));
  renderGrid('popularGrid', popular.slice(0,4));
  renderGrid('mainGrid', db);
}

// رندر شبكة معينة
function renderGrid(targetId, data) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  grid.innerHTML = data.map(b => `
    <div class="book-card" onclick="viewBook(${b.id})">
      <img src="${b.cover}" alt="${b.title}">
      <h4 class="royal-font">${b.title}</h4>
      <small>${b.author || ''}</small>
      <div style="margin-top:8px;">
        <button class="gold-btn" onclick="event.stopPropagation(); addToMyList(${b.id})">قراءة</button>
      </div>
    </div>
  `).join('');
}

// التنقّل بين الأقسام
function nav(id, btn) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active-section');
  if (btn) btn.classList.add('active');
  // عند الدخول لقائمتي نحدث القوائم
  if (id === 'mylist') renderGrid('readingGrid', db.filter(b => b.status === 'reading'));
}

// عرض صفحة كتاب (مبدئياً تنبيه، يمكن تطوير صفحة مستقلة)
function viewBook(id) {
  const book = db.find(x => x.id === id);
  if (!book) return alert('الكتاب غير موجود');
  alert(`عنوان: ${book.title}\nالمؤلف: ${book.author || 'غير معلوم'}`);
}

// إضافة إلى قائمتي (تغيير حالة)
function addToMyList(id) {
  const book = db.find(x => x.id === id);
  if (!book) return;
  book.status = 'reading';
  save();
  updateStats();
  refreshHome();
  alert('تمت الإضافة إلى قائمتي');
}

// تفعيل/تعطيل مفضل
function toggleFavIndex(i) {
  if (typeof i !== 'number' || !db[i]) return;
  db[i].fav = !db[i].fav;
  save();
  renderFavs();
}

// نشر كتاب من لوحة المالك
function publishBook() {
  const t = document.getElementById('ownerBookTitle').value.trim();
  const a = document.getElementById('ownerBookAuthor').value.trim() || 'مؤلف غير معروف';
  if (!t) return alert('ادخل عنوان الكتاب');
  const newBook = {
    id: Date.now(),
    title: t,
    author: a,
    cover: `https://via.placeholder.com/200x300/D4AF37/white?text=${encodeURIComponent(t)}`,
    fav: false,
    status: 'reading',
    views: 0,
    date: new Date().toISOString().split('T')[0]
  };
  db.unshift(newBook);
  save();
  refreshHome();
  document.getElementById('ownerBookTitle').value = '';
  document.getElementById('ownerBookAuthor').value = '';
  alert('نُشر الكتاب بنجاح 🚀');
}

// حفظ في التخزين المحلي وتحديث الإحصائيات
function save() {
  localStorage.setItem('tibyan_db', JSON.stringify(db));
  updateStats();
}

// إحصائيات الصفحة "أنا"
function updateStats() {
  const elAll = document.getElementById('statMyList');
  const elDone = document.getElementById('statCompleted');
  if (elAll) elAll.innerText = db.length;
  if (elDone) elDone.innerText = db.filter(b => b.status === 'completed').length;
  renderFavs();
}

// رندر المفضلات
function renderFavs() {
  const favGrid = document.getElementById('favGrid');
  if (!favGrid) return;
  favGrid.innerHTML = db.filter(b => b.fav).map(b => `
    <div class="book-card">
      <img src="${b.cover}" alt="${b.title}">
      <h4>${b.title}</h4>
      <small>${b.author}</small>
    </div>
  `).join('');
}

// وضع كلمة/حكمة اليوم من لوحة المالك
function setDailyWord() {
  const v = document.getElementById('dailyWord').value.trim();
  if (!v) return alert('اكتب الحكمة أو كلمة اليوم');
  document.getElementById('dailyQuoteDisplay').innerText = v;
  document.getElementById('dailyWord').value = '';
  alert('تم حفظ كلمة اليوم ✨');
}

// تبديل الوضع الليلي (تعديله لاحقاً ليصبح أكثر دقّة)
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  alert('تم تبديل الوضع (قيد التحسين لاحقاً) 🌙');
}
