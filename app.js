// قاعدة البيانات والتخزين
let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { title: "زاد المعاد", author: "ابن القيم", cover: "https://via.placeholder.com/200x300/3E2723/white?text=Zad", fav: true, status: "reading" },
    { title: "رياض الصالحين", author: "النووي", cover: "https://via.placeholder.com/200x300/D4AF37/white?text=Riyad", fav: false, status: "completed" }
];

// تشغيل عند التحميل
window.onload = () => {
    render();
    updateStats();
    setTimeout(() => {
        document.getElementById("splash").style.display = "none";
    }, 2500);
};

// تابع البحث والسر الخطير
function liveSearch() {
    const input = document.getElementById('searchField');
    const q = input.value.trim().toLowerCase();

    // حركة حيزوم السرية
    if (q === 'heizoum') {
        const ownerBtn = document.getElementById('ownerNavBtn');
        if (ownerBtn.style.display === 'none') {
            ownerBtn.style.display = 'flex';
            alert("تم تفعيل صلاحيات المالك يا كحيلان 🛡️");
        } else {
            ownerBtn.style.display = 'none';
            nav('home', document.querySelector('.nav-item'));
            alert("تم إغلاق لوحة التحكم 🔒");
        }
        input.value = ''; // تصفير البحث
        return;
    }

    const filtered = db.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    render(filtered);
}

// التنقل بين الصفحات
function nav(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    
    document.getElementById(id).classList.add('active-section');
    btn.classList.add('active');
}

// عرض الكتب
function render(data = db) {
    const mainGrid = document.getElementById('mainGrid');
    const favGrid = document.getElementById('favGrid');
    
    if(mainGrid) {
        mainGrid.innerHTML = data.map((book, i) => createCard(book, i)).join('');
    }
    
    if(favGrid) {
        favGrid.innerHTML = db.filter(b => b.fav).map((book, i) => createCard(book, i)).join('');
    }
}

function createCard(book, i) {
    return `
        <div class="book-card">
            <img src="${book.cover}">
            <h4>${book.title}</h4>
            <button onclick="toggleFav(${i})" style="border:none; background:none;">
                ${book.fav ? '💖' : '📌'}
            </button>
        </div>
    `;
}

function toggleFav(i) {
    db[i].fav = !db[i].fav;
    save();
    render();
}

function save() {
    localStorage.setItem('tibyan_db', JSON.stringify(db));
    updateStats();
}

function updateStats() {
    document.getElementById('statMyList').innerText = db.length;
    document.getElementById('statCompleted').innerText = db.filter(b => b.status === 'completed').length;
}

function publishBook() {
    const name = document.getElementById('ownerCode').value;
    if(name) {
        db.push({ title: name, author: "حيزوم", cover: "https://via.placeholder.com/200/D4AF37/white?text="+name, fav: false, status: "reading" });
        save(); render();
        alert("نُشر الكتاب بنجاح! 🚀");
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    alert("الوضع الليلي قيد التحسين.. قريباً يا بطل! 🌙");
}
