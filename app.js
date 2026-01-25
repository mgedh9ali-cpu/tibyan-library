// قاعدة بيانات المكتبة (تخزين محلي)
let library = JSON.parse(localStorage.getItem('tibyan_pro_db')) || [];

// 1. نظام التنقل بين الأقسام
function nav(id, btn) {
    document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
}

// 2. محرك عرض الكتب (معالجة الأحجام الضخمة)
function renderLibrary(data = library, target = 'mainGrid') {
    const grid = document.getElementById(target);
    grid.innerHTML = '';
    data.forEach((book, i) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${book.cover || 'https://via.placeholder.com/200x300?text=Tibyan'}">
            <h4 style="font-size:12px; margin:10px 0; height:32px; overflow:hidden;">${book.title}</h4>
            <div style="display:flex; gap:5px;">
                <button onclick="openBook(${i})" style="flex:1; background:var(--primary); color:white; border:none; padding:8px; border-radius:5px; font-size:10px;">قراءة</button>
                <button onclick="openAudio(${i})" style="flex:1; background:var(--gold); color:white; border:none; padding:8px; border-radius:5px; font-size:10px;">استماع</button>
            </div>
            <button onclick="toggleFav(${i})" style="background:none; border:none; color:var(--gold); font-size:10px; margin-top:10px; cursor:pointer;">
                ${book.fav ? '⭐ مضاف لقائمتي' : '+ إضافة لقائمتي'}
            </button>
        `;
        grid.appendChild(card);
    });
}

// 3. محرك الفحص الذكي (Scan) والسينما الصوتية
function openAudio(i) {
    const panel = document.getElementById('audio-panel');
    panel.style.display = 'block';
    document.getElementById('atitle').innerText = library[i].title;
    document.getElementById('ascan').innerText = "جاري فحص سلامة الملف وتجهيز الفصول...";
    
    // محاكاة المسح الذكي
    setTimeout(() => {
        document.getElementById('ascan').innerText = "تم التقسيم لـ 12 فصل صوتي (جاهز) ✅";
    }, 2000);
}

function setQuality(q) {
    const msgs = { high: "HD جاري التحميل بأعلى جودة", mid: "جاري التحميل بجودة متوسطة", low: "جاري التحميل بالوضع الاقتصادي" };
    alert(msgs[q]);
}

// 4. ميزة التلخيص الخارجي والبحث
function exportSummary() {
    const text = "ملخص مشروع تبيان الذكي\nالمطور: أحمد محمد محمد علي\nتم استخراج هذا التلخيص بنجاح.";
    const blob = new Blob([text], {type: 'text/plain'});
    const a = document.createElement('a');
    a.download = 'tibyan_summary.txt';
    a.href = URL.createObjectURL(blob);
    a.click();
}

function liveSearch() {
    const q = document.getElementById('mainSearch').value.toLowerCase();
    const filtered = library.filter(b => b.title.toLowerCase().includes(q));
    renderLibrary(filtered, 'mainGrid');
}

function listSearchFunc() {
    const q = document.getElementById('listSearch').value.toLowerCase();
    const filtered = library.filter(b => b.fav && b.title.toLowerCase().includes(q));
    renderLibrary(filtered, 'mylistGrid');
}

// 5. إدارة الكتب
function addNewBook() {
    const t = prompt("عنوان الكتاب؟");
    const l = prompt("رابط الـ PDF؟");
    if (t && l) {
        library.push({ title: t, link: l, fav: false, isRead: false });
        localStorage.setItem('tibyan_pro_db', JSON.stringify(library));
        renderLibrary();
    }
}

function toggleFav(i) {
    library[i].fav = !library[i].fav;
    localStorage.setItem('tibyan_pro_db', JSON.stringify(library));
    renderLibrary();
    renderLibrary(library.filter(b => b.fav), 'mylistGrid');
}

function toggleSilentMode() {
    const isSilent = document.getElementById('silent-mode').checked;
    alert(isSilent ? "تم تفعيل القراءة الصامتة (هدوء)" : "تم تفعيل السينما الصوتية 🎭");
}

function hideAudioPanel() { document.getElementById('audio-panel').style.display = 'none'; }

// 6. تشغيل PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

window.onload = () => {
    renderLibrary();
    renderLibrary(library.filter(b => b.fav), 'mylistGrid');
};
