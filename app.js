// قاعدة بيانات ذكية مخزنة في المتصفح
let tibyanDB = JSON.parse(localStorage.getItem('tibyan_core')) || [
    { id: 1, title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=زاد+المعاد", fav: true, status: "reading", views: 245, date: "2026-01-20" },
    { id: 2, title: "رياض الصالحين", author: "النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=رياض+الصالحين", fav: false, status: "completed", views: 512, date: "2026-01-25" },
    { id: 3, title: "الداء والدواء", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/2C1B18/white?text=الداء+والدواء", fav: true, status: "reading", views: 180, date: "2026-01-15" }
];

// عند تحميل الصفحة
window.onload = () => {
    // تشغيل فيديو الافتتاحية
    const video = document.getElementById('introVideo');
    if(video) video.play();

    // عرض البيانات
    renderHomePage();
    updateUserStats();

    // إخفاء الـ Splash بعد 4 ثواني
    setTimeout(() => {
        const splash = document.getElementById("splash");
        splash.style.opacity = '0';
        setTimeout(() => splash.style.display = "none", 1000);
    }, 4000);
};

// وظيفة البحث الفوري وحركة "heizoum" السرية
function liveSearch() {
    const input = document.getElementById('searchField');
    const q = input.value.trim().toLowerCase();

    // الحركة السرية يا ملك
    if (q === 'heizoum') {
        const ownerBtn = document.getElementById('ownerNavBtn');
        ownerBtn.style.display = (ownerBtn.style.display === 'none') ? 'flex' : 'none';
        alert(ownerBtn.style.display === 'flex' ? "أهلاً بك يا حيزوم في لوحة التحكم 🛡️" : "تم تأمين اللوحة 🔒");
        input.value = ''; return;
    }

    if (q.length > 0) {
        const results = tibyanDB.filter(b => b.title.includes(q) || b.author.includes(q));
        renderGrid('mainGrid', results);
    } else {
        renderHomePage();
    }
}

// تبديل الصفحات بنعومة
function nav(sectionId, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active-section');
    btn.classList.add('active');

    if(sectionId === 'mylist') filterBooks('reading', document.querySelector('.tab-item'));
}

// تحديث الصفحة الرئيسية
function renderHomePage() {
    // 1. المضافة حديثاً (آخر 4 كتب)
    const recent = [...tibyanDB].sort((a, b) => new Date(b.date) - new Date(a.date));
    renderGrid('recentGrid', recent.slice(0, 5));

    // 2. الأكثر قراءة
    const popular = [...tibyanDB].sort((a, b) => b.views - a.views);
    renderGrid('popularGrid', popular.slice(0, 4));

    // 3. المكتبة العامة
    renderGrid('mainGrid', tibyanDB);
}

// عرض الكتب في الشبكة
function renderGrid(targetId, data) {
    const container = document.getElementById(targetId);
    if (!container) return;

    container.innerHTML = data.map(book => `
        <div class="book-card">
            <img src="${book.cover}" alt="${book.title}">
            <h4 class="royal-font">${book.title}</h4>
            <small>${book.author}</small>
            <div style="margin-top:10px">
                <button onclick="toggleFavorite(${book.id})" style="border:none; background:none; cursor:pointer">
                    ${book.fav ? '💖' : '📌'}
                </button>
            </div>
        </div>
    `).join('');
}

// نظام الورد اليومي
function updateWard() {
    const pages = parseInt(document.getElementById('pageInput').value) || 0;
    const goal = 20; // الورد الافتراضي 20 صفحة
    const percent = Math.min(100, (pages / goal) * 100);

    document.getElementById('wardFill').style.width = percent + '%';
    document.getElementById('wardPercent').innerText = Math.floor(percent) + '%';
    document.getElementById('wardStatus').innerText = `أنجزت ${pages} من ${goal} صفحة`;
}

// تصفية الكتب في "قائمتي"
function filterBooks(status, btn) {
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    let filtered;
    if (status === 'fav') {
        filtered = tibyanDB.filter(b => b.fav);
    } else {
        filtered = tibyanDB.filter(b => b.status === status);
    }
    
    renderGrid('listGrid', filtered);
    renderAuthorsList();
}

// عرض قائمة المؤلفين
function renderAuthorsList() {
    const authors = [...new Set(tibyanDB.map(b => b.author))];
    document.getElementById('authorsList').innerHTML = authors.map(a => `
        <span class="author-chip">${a} (${tibyanDB.filter(b => b.author === a).length})</span>
    `).join('');
}

// إحصائيات المستخدم
function updateUserStats() {
    document.getElementById('statTotalBooks').innerText = tibyanDB.length;
    document.getElementById('statFinishedBooks').innerText = tibyanDB.filter(b => b.status === 'completed').length;
}

// نشر كتاب جديد (لوحة المالك)
function publishBook() {
    const title = document.getElementById('ownerBookTitle').value;
    const author = document.getElementById('ownerBookAuthor').value;
    const cover = document.getElementById('ownerBookCover').value || "https://via.placeholder.com/200/2C1B18/white?text="+title;

    if (title && author) {
        const newBook = {
            id: Date.now(),
            title: title,
            author: author,
            cover: cover,
            fav: false,
            status: 'reading',
            views: 0,
            date: new Date().toISOString()
        };

        tibyanDB.push(newBook);
        localStorage.setItem('tibyan_core', JSON.stringify(tibyanDB));
        alert("تم إضافة الكتاب لمكتبة تبيان بنجاح! 🚀");
        renderHomePage();
        updateUserStats();
    } else {
        alert("يا معلم عبي البيانات أول! 😉");
    }
}

function toggleFavorite(id) {
    const book = tibyanDB.find(b => b.id === id);
    if(book) {
        book.fav = !book.fav;
        localStorage.setItem('tibyan_core', JSON.stringify(tibyanDB));
        renderHomePage();
    }
}
