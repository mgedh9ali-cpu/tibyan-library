let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=زاد+المعاد", fav: true, status: "reading" },
    { title: "رياض الصالحين", author: "النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=رياض+الصالحين", fav: false, status: "completed" }
];

window.onload = () => {
    render();
    updateStats();
    setTimeout(() => {
        const splash = document.getElementById("splash");
        if(splash) splash.style.opacity = '0';
        setTimeout(() => splash.style.display = 'none', 500);
    }, 2500);
};

// محرك البحث + الشيفرة السرية
function liveSearch() {
    const input = document.getElementById('searchField');
    const val = input.value.trim().toLowerCase();

    // المفتاح السري لحيزوم
    if (val === 'heizoum') {
        const secretBtn = document.getElementById('ownerNavBtn');
        if (secretBtn.style.display === 'none') {
            secretBtn.style.display = 'flex';
            alert("مرحباً بك يا كحيلان.. تم فتح عرش المالك 🛡️");
        } else {
            secretBtn.style.display = 'none';
            nav('home', document.querySelector('.nav-item'));
            alert("تم إغلاق العرش بنجاح 🔒");
        }
        input.value = '';
        return;
    }

    const filtered = db.filter(b => b.title.includes(val) || b.author.includes(val));
    render(filtered);
}

// التنقل بين السكاشن
function nav(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    
    document.getElementById(id).classList.add('active-section');
    btn.classList.add('active');
}

// عرض الكتب
function render(data = db) {
    const grid = document.getElementById('mainGrid');
    const favGrid = document.getElementById('favGrid');
    
    const html = data.map((book, i) => `
        <div class="book-card">
            <img src="${book.cover}" alt="${book.title}">
            <h4>${book.title}</h4>
            <button onclick="toggleFav(${i})" style="border:none; background:none; font-size:20px; cursor:pointer;">
                ${book.fav ? '💖' : '📌'}
            </button>
        </div>
    `).join('');

    if(grid) grid.innerHTML = html;
    if(favGrid) favGrid.innerHTML = db.filter(b => b.fav).map((b, i) => `
        <div class="book-card"><img src="${b.cover}"><h4>${b.title}</h4></div>
    `).join('');
}

function toggleFav(i) {
    db[i].fav = !db[i].fav;
    save();
}

function save() {
    localStorage.setItem('tibyan_db', JSON.stringify(db));
    render();
    updateStats();
}

function updateStats() {
    document.getElementById('statMyList').innerText = db.length;
    document.getElementById('statCompleted').innerText = db.filter(b => b.status === 'completed').length;
}

function publishBook() {
    const title = document.getElementById('ownerBookTitle').value;
    if(title) {
        db.push({ title, author: "حيزوم", cover: "https://via.placeholder.com/200/2C1B18/white?text="+title, fav: false, status: "reading" });
        save();
        document.getElementById('ownerBookTitle').value = '';
        alert("تم إضافة الكتاب لعرشك يا ملك! 🚀");
    }
}
