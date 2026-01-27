/*
  ملف: app.js
  الغرض: إدارة الحالة والوظائف التفاعلية لتطبيق "تبيان"
  - إدارة التنقل بين الأقسام
  - تفعيل الوضع الليلي وتغيير الثيم
  - إدارة مكتبتي والكتب
  - القارئ: تظليل، اقتباس، تكبير/تصغير
  - قائمة الاقتباسات والتصدير مع الشعار
  - محرك التوصيات الذكية البسيط
  - نقاط ربط API مستقبلية
  جميع الوظائف موثقة بتعليقات عربية واضحة
*/

// الحالة العامة للتطبيق
const appState = {
  theme: 'royal', // أو 'classic', 'modern'
  darkMode: false,
  fontSize: 16,
  smartRecommendations: true,
  user: {
    name: 'اسم المستخدم',
    booksRead: 0,
    readingHours: 0,
    achievements: [],
    library: [],
    quotes: []
  },
  currentSection: 'main',
  books: [], // جميع الكتب المتاحة
  recommendations: []
};

/* ----------------- إدارة التنقل بين الأقسام ----------------- */
const sections = {
  main: document.querySelector('.main'),
  library: document.getElementById('library-section'),
  profile: document.getElementById('profile-section'),
  settings: document.getElementById('settings-section'),
  reader: document.getElementById('reader-section'),
  quotes: document.getElementById('quotes-section')
};
const navButtons = document.querySelectorAll('.bottom-nav__item');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // إخفاء جميع الأقسام
    Object.values(sections).forEach(sec => sec && (sec.hidden = true));
    // إزالة تفعيل جميع الأزرار
    navButtons.forEach(b => b.classList.remove('bottom-nav__item--active'));
    // إظهار القسم المطلوب
    const section = btn.getAttribute('data-section');
    if (sections[section]) {
      sections[section].hidden = false;
      appState.currentSection = section;
    }
    btn.classList.add('bottom-nav__item--active');
    // تحديث العنوان أو البيانات حسب القسم
    if (section === 'profile') updateProfile();
    if (section === 'library') renderLibrary();
    if (section === 'main') renderRecommendations();
    if (section === 'quotes') renderQuotes();
  });
});

/* ----------------- الوضع الليلي وتغيير الثيم ----------------- */
const themeToggle = document.getElementById('theme-toggle');
const themeSelect = document.getElementById('theme-select');
themeToggle.addEventListener('change', () => {
  appState.darkMode = themeToggle.checked;
  document.body.classList.toggle('app--theme-dark', appState.darkMode);
});
themeSelect.addEventListener('change', () => {
  appState.theme = themeSelect.value;
  // يمكن هنا تغيير متغيرات CSS حسب الثيم المختار
});

/* ----------------- حجم الخط وتفضيلات القراءة ----------------- */
const fontSizeRange = document.getElementById('font-size-range');
fontSizeRange.addEventListener('input', () => {
  appState.fontSize = fontSizeRange.value;
  document.body.style.fontSize = `${appState.fontSize}px`;
});

/* ----------------- إدارة مكتبتي ----------------- */
function renderLibrary() {
  const list = document.getElementById('library-list');
  list.innerHTML = '';
  appState.user.library.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" class="book-card__cover">
      <div class="book-card__title">${book.title}</div>
      <div class="book-card__author">${book.author}</div>
      <div class="book-card__actions">
        <button class="btn btn--secondary" onclick="openReader('${book.id}')">قراءة</button>
        <button class="btn btn--primary" onclick="addQuote('${book.id}')">اقتباس</button>
      </div>
    `;
    list.appendChild(card);
  });
}

/* ----------------- القارئ: تظليل، اقتباس، تكبير/تصغير ----------------- */
function openReader(bookId) {
  // إظهار قسم القارئ وإخفاء البقية
  Object.values(sections).forEach(sec => sec && (sec.hidden = true));
  sections.reader.hidden = false;
  // تحميل نص الكتاب (محاكاة)
  const book = appState.books.find(b => b.id === bookId) || {};
  const content = document.getElementById('reader-content');
  content.textContent = book.content || 'نص الكتاب غير متوفر حالياً.';
  // تحديث الحالة
  appState.currentBook = book;
}
document.getElementById('zoom-in-btn').addEventListener('click', () => {
  appState.fontSize = Math.min(appState.fontSize + 2, 28);
  document.getElementById('reader-content').style.fontSize = `${appState.fontSize}px`;
});
document.getElementById('zoom-out-btn').addEventListener('click', () => {
  appState.fontSize = Math.max(appState.fontSize - 2, 12);
  document.getElementById('reader-content').style.fontSize = `${appState.fontSize}px`;
});
document.getElementById('highlight-btn').addEventListener('click', () => {
  // تظليل النص المحدد
  const selection = window.getSelection();
  if (selection && selection.toString()) {
    const span = document.createElement('span');
    span.style.background = 'var(--color-accent)';
    span.style.color = '#fff';
    span.textContent = selection.toString();
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);
    selection.removeAllRanges();
  }
});
document.getElementById('quote-btn').addEventListener('click', () => {
  // إضافة النص المحدد إلى قائمة الاقتباسات
  const selection = window.getSelection();
  if (selection && selection.toString()) {
    appState.user.quotes.push({
      text: selection.toString(),
      book: appState.currentBook.title,
      date: new Date().toLocaleDateString()
    });
    alert('تمت إضافة الاقتباس!');
    selection.removeAllRanges();
  }
});

/* ----------------- قائمة الاقتباسات والتصدير ----------------- */
function renderQuotes() {
  const list = document.getElementById('quotes-list');
  list.innerHTML = '';
  appState.user.quotes.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'quote-card';
    card.innerHTML = `
      <div class="quote-card__text">"${q.text}"</div>
      <div class="quote-card__meta">${q.book} - ${q.date}</div>
      <div class="quote-card__actions">
        <button onclick="editQuote(${i})">تعديل</button>
        <button onclick="deleteQuote(${i})">حذف</button>
      </div>
    `;
    list.appendChild(card);
  });
}
function editQuote(index) {
  const newText = prompt('تعديل الاقتباس:', appState.user.quotes[index].text);
  if (newText) {
    appState.user.quotes[index].text = newText;
    renderQuotes();
  }
}
function deleteQuote(index) {
  if (confirm('هل أنت متأكد من حذف الاقتباس؟')) {
    appState.user.quotes.splice(index, 1);
    renderQuotes();
  }
}
document.getElementById('export-quotes-btn').addEventListener('click', exportQuotesPDF);

function exportQuotesPDF() {
  // تصدير جميع الاقتباسات إلى PDF مع الشعار (باستخدام html2pdf.js)
  const quotesHtml = `
    <div style="font-family: 'Cairo', sans-serif; direction: rtl;">
      <img src="assets/logo-tibyan.svg" alt="شعار تبيان" style="height: 48px; margin-bottom: 1rem;">
      <h2 style="color: #2b3d50;">اقتباساتي من تبيان</h2>
      <ul>
        ${appState.user.quotes.map(q => `<li style="margin-bottom: 1rem;"><b>"${q.text}"</b><br><span style="color: #888;">${q.book} - ${q.date}</span></li>`).join('')}
      </ul>
    </div>
  `;
  // استخدام html2pdf.js (يجب تضمين المكتبة في HTML)
  if (window.html2pdf) {
    html2pdf().from(quotesHtml).set({
      margin: 1,
      filename: 'tibyan-quotes.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }).save();
  } else {
    alert('يرجى تضمين مكتبة html2pdf.js للتصدير.');
  }
}

/* ----------------- التوصيات الذكية (محرك توصية بسيط) ----------------- */
function renderRecommendations() {
  const list = document.getElementById('recommendations-list');
  list.innerHTML = '';
  // محاكاة: اقتراح كتب بناءً على آخر كتاب قرأه المستخدم
  const lastBook = appState.user.library[appState.user.library.length - 1];
  let recs = [];
  if (lastBook) {
    recs = appState.books.filter(b => b.genre === lastBook.genre && b.id !== lastBook.id).slice(0, 4);
  } else {
    recs = appState.books.slice(0, 4);
  }
  recs.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" class="book-card__cover">
      <div class="book-card__title">${book.title}</div>
      <div class="book-card__author">${book.author}</div>
      <div class="book-card__actions">
        <button class="btn btn--primary" onclick="addToLibrary('${book.id}')">إضافة لمكتبتي</button>
      </div>
    `;
    list.appendChild(card);
  });
}
function addToLibrary(bookId) {
  const book = appState.books.find(b => b.id === bookId);
  if (book && !appState.user.library.some(b => b.id === bookId)) {
    appState.user.library.push(book);
    alert('تمت إضافة الكتاب إلى مكتبتك!');
    renderLibrary();
  }
}

/* ----------------- تحديث ملف المستخدم والإنجازات ----------------- */
function updateProfile() {
  document.getElementById('user-name').textContent = appState.user.name;
  document.getElementById('books-read').textContent = appState.user.booksRead;
  document.getElementById('reading-hours').textContent = appState.user.readingHours;
  // عرض الإنجازات (محاكاة)
  const achievementsList = document.getElementById('achievements-list');
  achievementsList.innerHTML = '';
  appState.user.achievements.forEach(a => {
    const badge = document.createElement('span');
    badge.className = 'achievement-badge';
    badge.textContent = a;
    achievementsList.appendChild(badge);
  });
}

/* ----------------- نقاط ربط API مستقبلية ----------------- */
// مثال: جلب الكتب من قاعدة بيانات خارجية
async function fetchBooks() {
  // يمكن استبدال هذا الرابط بواجهة API حقيقية لاحقاً
  const response = await fetch('api/books.json');
  if (response.ok) {
    appState.books = await response.json();
    renderRecommendations();
    renderLibrary();
  }
}
// عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
  fetchBooks();
  renderRecommendations();
  renderLibrary();
  updateProfile();
});

/* ----------------- دعم الوصولية ----------------- */
// التأكد من إمكانية التنقل عبر لوحة المفاتيح
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
  }
});
document.addEventListener('mousedown', () => {
  document.body.classList.remove('user-is-tabbing');
});

/* ----------------- ملاحظات وتعليقات إضافية ----------------- */
/*
- جميع الوظائف قابلة للتوسعة والربط مع قاعدة بيانات أو API خارجي.
- تم توثيق جميع النقاط الحرجة لتعزيز سهولة الصيانة.
- يمكن إضافة اختبارات وحدوية (Unit Tests) لاحقاً باستخدام مكتبات مثل Jest.
- جميع الأحداث والوظائف تدعم RTL والوصولية.
*/
