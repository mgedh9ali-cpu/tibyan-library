let currentBookIndex = null;
let naturePlayer = new Audio(); naturePlayer.loop = true;
const moodLibrary = { "مقدمة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", "هدوء": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" };

window.onload = () => { loadBooks(); updateAchievement(); setDailyChallenge(); };

// --- 1. تحدي اليوم ---
function setDailyChallenge() {
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    if (saved.length === 0) return;
    const today = new Date().toDateString();
    if (localStorage.getItem('challengeDate') !== today) {
        const book = saved[Math.floor(Math.random() * saved.length)];
        localStorage.setItem('challengeDate', today);
        localStorage.setItem('dailyBook', JSON.stringify(book));
    }
    const daily = JSON.parse(localStorage.getItem('dailyBook'));
    document.getElementById('daily-challenge').style.display = 'block';
    document.getElementById('challenge-task').innerText = `تحدي حيزوم لليوم: قراءة "${daily.title}"`;
    document.getElementById('challenge-btn').onclick = () => openBook(saved.findIndex(b => b.title === daily.title));
}

// --- 2. الإنجاز ---
function updateAchievement() {
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    const readCount = saved.filter(b => b.rank > 0).length;
    const percent = (readCount / (saved.length || 1)) * 100;
    document.getElementById('progress-bar').style.width = percent + "%";
    document.getElementById('achievement-text').innerText = `أنجزت ${readCount} كتاباً من أصل ${saved.length}`;
}

// --- 3. محرك الكتب والبحث ---
function loadBooks(filter = "") {
    const grid = document.getElementById('booksGrid'); grid.innerHTML = '';
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    saved.forEach((book, index) => {
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
            const card = document.createElement('div');
            card.style = "min-width:140px; background:white; padding:10px; border-radius:10px; text-align:center; position:relative; flex-shrink:0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
            card.innerHTML = `
                <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;">X</button>
                <img src="${book.cover}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
                <h4 style="font-size:12px; height:30px; overflow:hidden; margin:5px 0;">${book.title}</h4>
                <div style="display:flex; gap:5px;">
                    <button onclick="openBook(${index})" style="background:#3e2723; color:white; border:none; padding:5px; border-radius:5px; flex:1; cursor:pointer; font-size:10px;">قراءة</button>
                    <button onclick="openNotes(${index})" style="background:#d4af37; color:white; border:none; padding:5px; border-radius:5px; flex:1; cursor:pointer; font-size:10px;">كناشة</button>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

function openBook(index) {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    saved[index].rank = (saved[index].rank || 0) + 1;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    window.open(saved[index].link, '_blank');
    loadBooks(); updateAchievement(); openChapterEngine(saved[index].title);
}

function searchBooks() { loadBooks(document.getElementById('bookSearch').value); }

function addNewBook() {
    let t = prompt("اسم الكتاب؟"), l = prompt("رابط PDF؟"), c = prompt("رابط الغلاف؟");
    if (t && l) {
        let s = JSON.parse(localStorage.getItem('myBooks')) || [];
        s.push({ title: t, link: l, cover: c || 'https://via.placeholder.com/150', rank: 0, note: "" });
        localStorage.setItem('myBooks', JSON.stringify(s)); loadBooks(); updateAchievement();
    }
}

function deleteBook(i) { if(confirm("حيزوم، متأكد؟")) { let s = JSON.parse(localStorage.getItem('myBooks')); s.splice(i, 1); localStorage.setItem('myBooks', JSON.stringify(s)); loadBooks(); updateAchievement(); } }

// --- 4. الكناشة ---
function openNotes(index) {
    currentBookIndex = index;
    const book = JSON.parse(localStorage.getItem('myBooks'))[index];
    document.getElementById('notes-section').style.display = 'block';
    document.getElementById('note-book-title').innerText = book.title;
    document.getElementById('book-note-input').value = book.note || "";
    document.getElementById('saved-notes-list').innerText = book.note ? "الملاحظة محفوظة ✅" : "";
}

function saveNote() {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    saved[currentBookIndex].note = document.getElementById('book-note-input').value;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    alert("تم الحفظ في كناشة حيزوم 📌");
}

// --- 5. الصوتيات والسينما ---
function openChapterEngine(title) {
    const list = document.getElementById('chapters-list'); list.innerHTML = '';
    const chapters = [{n:"المقدمة", m:"مقدمة"}, {n:"الدرس الأول", m:"هدوء"}];
    chapters.forEach(ch => {
        const b = document.createElement('button'); b.innerText = ch.n;
        b.onclick = () => { naturePlayer.src = moodLibrary[ch.m]; naturePlayer.play(); };
        list.appendChild(b);
    });
}

function toggleNature() { naturePlayer.paused ? naturePlayer.play() : naturePlayer.pause(); }
function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page')); document.getElementById(id).classList.add('active-page'); }

// --- 6. تصدير المكتبة ---
function exportLibrary() {
    const data = localStorage.getItem('myBooks');
    const blob = new Blob([data], {type: 'application/json'});
    const a = document.createElement('a'); a.download = 'tibyan_backup.json'; a.href = window.URL.createObjectURL(blob); a.click();
}رر
