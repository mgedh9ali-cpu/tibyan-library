function nav(id, btn) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  document.getElementById(id).classList.add('active-section');
  document.querySelectorAll('.nav-bar button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function changeTheme() { alert("تغيير الثيم قيد التطوير"); }
function changeFontSize() { document.body.style.fontSize = "18px"; }
function editProfile() { const name = prompt("أدخل اسمك الجديد:"); if(name) document.getElementById('meName').innerText = name; }
function manageLibrary() { alert("إدارة المكتبة قيد التطوير"); }
function setWard() { alert("ورد يومي تم تحديده"); }
function toggleNotifications() { alert("الإشعارات مفعلة"); }
function logout() { alert("تم تسجيل الخروج"); }

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
  document.getElement
