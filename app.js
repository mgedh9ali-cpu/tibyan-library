let naturePlayer = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // تجريبي
naturePlayer.loop = true;

window.onload = () => {
    loadBooks();
    updateAchievement();
    setDailyChallenge();
};

// --- عرض الكتب (بدون تصنيفات) --- [cite: 481, 482]
function loadBooks(filter = "") {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];

    const filtered = saved.filter(book => book.title.toLowerCase().includes(filter.toLowerCase()));

    if (filtered.length === 0 && filter !== "") {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 20px;">
            عذراً حيزوم، هالكتاب مو موجود.. اطلبه من البوت: <br>
            <a href="https://t.me/TibyanBooks_bot" style="color:#d4af37;">@TibyanBooks_bot</a>
        </div>`; // [cite: 834, 835]
        return;
    }

    filtered.forEach((book, index) => {
        const card = document.createElement('div');
        card.style = "background:white; padding:10px; border-radius:10px; text-align:center; position:relative; box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
        card.innerHTML = `
            <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;">X</button>
            <img src="${book.cover || 'https://via.placeholder.com/150'}" style="width:100%; height:160px; object-fit:cover; border-radius:8px;">
            <h4 style="font-size:12px; height:30px; overflow:hidden; margin:8px 0;">${book.title}</h4>
            <div style="display:flex; gap:5px;">
                <button onclick="openBook(${index})" style="background:#3e2723; color:white; border:none; padding:5px; border-radius:5px; flex:1; cursor:pointer; font-size:10px;">قراءة</button>
                <button onclick="openNotes(${index})" style="background:#d4af37; color:white; border:none; padding:5px; border-radius:5px; flex:1; cursor:pointer; font-size:10px;">كناشة</button>
            </div>
        `; // [cite: 482, 558]
        grid.appendChild(card);
    });
}

// --- إضافة كتاب جديد (مبسطة) --- [cite: 483, 587]
function addNewBook() {
    let t = prompt("اسم الكتاب؟");
    let l = prompt("رابط PDF؟");
    let c = prompt("رابط الغلاف (اختياري)؟");
    if (t && l) {
        let s = JSON.parse(localStorage.getItem('myBooks')) || [];
        s.push({ title: t, link: l, cover: c || 'https://via.placeholder.com/150', rank: 0, note: "" });
        localStorage.setItem('myBooks', JSON.stringify(s));
        loadBooks();
        updateAchievement();
    }
}

// --- الدوال المساعدة ---
function openBook(index) {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    saved[index].rank = (saved[index].rank || 0) + 1;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    window.open(saved[index].link, '_blank');
    updateAchievement();
}

function deleteBook(i) {
    if(confirm("يا حيزوم، متأكد بدك تحذف هالفائدة؟")) {
        let s = JSON.parse(localStorage.getItem('myBooks'));
        s.splice(i, 1);
        localStorage.setItem('myBooks', JSON.stringify(s));
        loadBooks();
        updateAchievement();
    }
}

function searchBooks() {
    loadBooks(document.getElementById('bookSearch').value);
}

function toggleNature() {
    naturePlayer.paused ? naturePlayer.play() : naturePlayer.pause();
}

function updateAchievement() {
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    const read = saved.filter(b => b.rank > 0).length;
    const percent = (read / (saved.length || 1)) * 100;
    document.getElementById('progress-bar').style.width = percent + "%";
    document.getElementById('achievement-text').innerText = `أنجزت ${read} من ${saved.length} كتب.`;
}

function setDailyChallenge() {
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    if (saved.length === 0) return;
    const book = saved[Math.floor(Math.random() * saved.length)];
    document.getElementById('daily-challenge').style.display = 'block';
    document.getElementById('challenge-task').innerText = `تحدي اليوم: اقرأ 5 دقائق من "${book.title}"`;
    document.getElementById('challenge-btn').onclick = () => openBook(saved.indexOf(book));
}

function openNotes(index) {
    currentBookIndex = index;
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    const book = saved[index];
    document.getElementById('notes-section').style.display = 'block';
    document.getElementById('note-book-title').innerText = book.title;
    document.getElementById('book-note-input').value = book.note || "";
    document.getElementById('saved-notes-list').innerHTML = book.note ? `<strong>آخر فائدة:</strong><br>${book.note}` : "لا يوجد ملاحظات.";
}

function saveNote() {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    const noteContent = document.getElementById('book-note-input').value;
    saved[currentBookIndex].note = noteContent;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    alert("انحفظت الفائدة بالكناشة! 📌");
}
