/* ================================
   📚 مكتبة تبيان - ملف الوظائف الذكية
   ================================ */

/* 🔹 التنقل بين الصفحات */
function nav(id, btn) {
  // إخفاء كل الصفحات
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  // إظهار الصفحة المطلوبة
  document.getElementById(id).classList.add('active-section');
  // تحديث حالة الأزرار في الشريط السفلي
  document.querySelectorAll('.nav-bar button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* 🔹 البحث الذكي */
function smartSearch() {
  const query = document.getElementById('searchField').value.trim().toLowerCase();
  if(query === "heizoum") {
    // فتح صفحة المالك إذا كتب كلمة السر
    openOwnerPage();
  } else {
    alert("نتائج البحث قيد التطوير...");
  }
}

/* 🔹 فتح صفحة المالك */
function openOwnerPage() {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  document.getElementById('ownerPage').classList.add('active-section');
  updateOwnerStats();
}

/* 🔹 تحديث إحصائيات المالك */
function updateOwnerStats() {
  const books = JSON.parse(localStorage.getItem('tibyan_books')) || [];
  document.getElementById('statBooksOwner').innerText = books.length;

  const usersCount = localStorage.getItem('tibyan_users') || 1; 
  document.getElementById('statUsersOwner').innerText = usersCount;

  const quotes = JSON.parse(localStorage.getItem('tibyan_quotes')) || [];
  document.getElementById('statQuotesOwner').innerText = quotes.length;
}

/* 🔹 ورد يومي */
function setWard() {
  const ward = prompt("أدخل هدفك اليومي (عدد صفحات أو وقت):");
  if(ward) {
    localStorage.setItem('tibyan_ward', ward);
    document.getElementById('wardText').innerText = ward;
  }
}

/* 🔹 الاقتباسات */
function saveQuote() {
  const text = prompt("انسخ النص الذي تريد حفظه كاقتباس:");
  if(text) {
    let quotes = JSON.parse(localStorage.getItem('tibyan_quotes')) || [];
    quotes.push({ text: text, date: new Date().toLocaleString() });
    localStorage.setItem('tibyan_quotes', JSON.stringify(quotes));
    renderQuotes();
  }
}

function renderQuotes() {
  const quotes = JSON.parse(localStorage.getItem('tibyan_quotes')) || [];
  document.getElementById('quotesList').innerHTML = quotes.map(q => `
    <div class="quote-card">"${q.text}"<br><small>📅 ${q.date}</small></div>
  `).join('');
}

function exportQuotes() {
  const quotes = JSON.parse(localStorage.getItem('tibyan_quotes')) || [];
  let content = "📚 مكتبة تبيان - اقتباساتي\n\n";
  quotes.forEach(q => {
    content += `"${q.text}" - ${q.date}\n`;
  });
  alert("تم تجهيز ملف الاقتباسات:\n\n" + content);
}

/* 🔹 الإعدادات */
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function changeTheme() { alert("تغيير الثيم قيد التطوير"); }
function changeFontSize() { document.body.style.fontSize = "18px"; }
function editProfile() { 
  const name = prompt("أدخل اسمك الجديد:");
  if(name) document.getElementById('meName').innerText = name;
}
function manageLibrary() { alert("إدارة المكتبة قيد التطوير"); }
function toggleNotifications() { alert("الإشعارات مفعلة"); }
function logout() { alert("تم تسجيل الخروج"); }

/* 🔹 صفحة المالك - وظائف إضافية */
function addBook() {
  const title = prompt("عنوان الكتاب:");
  const author = prompt("اسم المؤلف:");
  if(title && author) {
    let books = JSON.parse(localStorage.getItem('tibyan_books')) || [];
    books.push({ title, author });
    localStorage.setItem('tibyan_books', JSON.stringify(books));
    updateOwnerStats();
    alert("تمت إضافة الكتاب بنجاح!");
  }
}

function showUsers() {
  const usersCount = localStorage.getItem('tibyan_users') || 1;
  alert("عدد المستخدمين الحالي: " + usersCount);
}

function updateDailyWord() {
  const word = prompt("أدخل كلمة اليوم الجديدة:");
  if(word) {
    localStorage.setItem('tibyan_daily_word', word);
    alert("تم تحديث كلمة اليوم: " + word);
  }
}

/* 🔹 تحية ملكية */
function showRoyalGreeting() {
  const greetings = [
    "👑 أهلاً بك يا فارس المعرفة!",
    "📚 مرحباً بك في قصر الكتب!",
    "✨ أهلاً بك يا حيزوم الملكي!"
  ];
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  document.getElementById('meName').innerText = randomGreeting;
}

/* استدعاء التحية عند تحميل الصفحة */
window.onload = function() {
  showRoyalGreeting();
  renderQuotes();
  const ward = localStorage.getItem('tibyan_ward');
  if(ward) document.getElementById('wardText').innerText = ward;
};
