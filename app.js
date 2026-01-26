let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=Zad", fav: false, status: "reading" },
    { title: "رياض الصالحين", author: "النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=Riyad", fav: false, status: "completed" }
];

window.onload = () => {
    render();
    renderLists();
    updateStats();
    setTimeout(() => {
        const splash = document.getElementById("splash");
        if(splash) splash.style.display = "none";
    }, 2500);
};

// التنقل الذكي
function nav(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(id).classList.add('active-section');
    btn.classList.add('active');
}

// عرض الكتب
function render(data = db, target = 'mainGrid') {
    const grid = document.getElementById(target);
    if (!grid) return;
    grid.innerHTML = data.map((book, i) => `
        <div class="book-card">
            <img src="${book.cover}" alt="${book.title}">
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <button onclick="toggleFav(${i})" style="border:none; background:none;">
                ${book.fav ? '💖' : '📌'}
            </button>
        </div>
    `).join('');
}

// البحث المباشر
function liveSearch() {
    const q = document.getElementById('searchField').value.toLowerCase();
    const results = db.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    render(results);
}

// تبديل المفضلة وحفظ البيانات
function toggleFav(i) {
    db[i].fav = !db[i].fav;
    localStorage.setItem('tibyan_db', JSON.stringify(db));
    render();
    renderLists();
}

// تحديث الإحصائيات في صفحة "أنا"
function updateStats() {
    if (document.getElementById('statMyList')) {
        document.getElementById('statMyList').innerText = db.length;
        document.getElementById('statCompleted').innerText = db.filter(b => b.status === 'completed').length;
        document.getElementById('statReading').innerText = db.filter(b => b.status === 'reading').length;
    }
}

function renderLists() {
    render(db.filter(b => b.status === 'reading'), 'readingGrid');
}

// لوحة المالك - إضافة كتاب جديد
function publishBook() {
    const title = document.getElementById('ownerCode').value;
    if (title) {
        db.push({ title, author: "مؤلف مضاف", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=Book", fav: false, status: "reading" });
        localStorage.setItem('tibyan_db', JSON.stringify(db));
        render();
        updateStats();
        alert("تم إضافة الكتاب بنجاح يا كحيلان! 🚀");
    }
}
