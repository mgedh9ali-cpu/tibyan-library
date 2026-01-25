// مصفوفة الكتب (قاعدة البيانات)
let library = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { title: "مقدمة ابن خلدون", author: "ابن خلدون", cover: "https://via.placeholder.com/150", fav: false },
    { title: "تفسير الجلالين", author: "السيوطي", cover: "https://via.placeholder.com/150", fav: false }
];

// وظيفة التنقل بين الصفحات
function showPage(pageId, btn) {
    document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    btn.classList.add('active');
}

// وظيفة عرض الكتب
function renderBooks(data = library, target = 'mainGrid') {
    const grid = document.getElementById(target);
    grid.innerHTML = '';
    data.forEach((book, i) => {
        grid.innerHTML += `
            <div class="book-card">
                <img src="${book.cover}">
                <h4>${book.title}</h4>
                <button onclick="openAudio('${book.title}')" style="background:var(--gold); color:white; border:none; padding:5px 10px; border-radius:5px;">استماع</button>
                <button onclick="toggleFav(${i})" style="background:none; border:none; color:red; margin-top:5px;">
                    <i class="${book.fav ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
        `;
    });
}

// البحث
function liveSearch() {
    const val = document.getElementById('mainSearch').value.toLowerCase();
    const filtered = library.filter(b => b.title.toLowerCase().includes(val));
    renderBooks(filtered);
}

// إضافة كتاب جديد
function addNewBook() {
    const title = prompt("عنوان الكتاب؟");
    if(title) {
        library.push({ title: title, author: "غير معروف", cover: "https://via.placeholder.com/150", fav: false });
        localStorage.setItem('tibyan_db', JSON.stringify(library));
        renderBooks();
    }
}

// مشغل الصوت
function openAudio(title) {
    document.getElementById('audio-title').innerText = title;
    document.getElementById('audio-console').style.display = 'block';
}

function closeAudio() { document.getElementById('audio-console').style.display = 'none'; }

function toggleFav(i) {
    library[i].fav = !library[i].fav;
    localStorage.setItem('tibyan_db', JSON.stringify(library));
    renderBooks();
    renderBooks(library.filter(b => b.fav), 'mylistGrid');
}

// تشغيل عند البداية
window.onload = () => {
    renderBooks();
    renderBooks(library.filter(b => b.fav), 'mylistGrid');
};
let library = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { title: "مقدمة ابن خلدون", cover: "https://via.placeholder.com/150", fav: false },
    { title: "تفسير الجلالين", cover: "https://via.placeholder.com/150", fav: false }
];

function showPage(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
}

function renderBooks() {
    const grid = document.getElementById('mainGrid');
    grid.innerHTML = '';
    library.forEach((book, i) => {
        grid.innerHTML += `
            <div class="book-card">
                <img src="${book.cover}">
                <h4>${book.title}</h4>
                <button onclick="toggleFav(${i})" style="color:${book.fav ? 'gold' : '#ccc'}; background:none; border:none; font-size:20px;">★</button>
            </div>
        `;
    });
}

function toggleFav(i) {
    library[i].fav = !library[i].fav;
    localStorage.setItem('tibyan_db', JSON.stringify(library));
    renderBooks();
}

window.onload = renderBooks;
