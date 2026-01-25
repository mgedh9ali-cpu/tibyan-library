let naturePlayer = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); 
naturePlayer.loop = true;
let currentBookIndex = null;

window.onload = () => {
    loadBooks();
    updateAchievement();
};

// --- عرض الكتب الموحد (بدون تصنيفات) ---
function loadBooks(filter = "") {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];

    const filtered = saved.filter(book => book.title.toLowerCase().includes(filter.toLowerCase()));

    if (filtered.length === 0 && filter !== "") {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            يا حيزوم، هالكتاب مو موجود.. اطلبه من البوت: <br><br>
            <a href="https://t.me/TibyanBooks_bot" style="color:#d4af37; font-weight:bold; text-decoration:none;">@TibyanBooks_bot 🤖</a>
        </div>`;
        return;
    }

    filtered.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = "book-card";
        card.innerHTML = `
            <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; background:#e74c3c; color:white; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-size:10px;">X</button>
            <img src="${book.cover || 'https://via.placeholder.com/150x200?text=Tibyan'}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
            <h4 style="font-size:13px; margin:10px 0; height:32px; overflow:hidden;">${book.title}</h4>
            <div style="display:flex; gap:5px;">
                <button onclick="openBook(${index})" style="background:#3e2723; color:white; border:none; padding:8px; border-radius:5px; flex:1; cursor:pointer;">قراءة</button>
                <button onclick="openNotes(${index})" style="background:#d4af37; color:white; border:none; padding:8px; border-radius:5px; flex:1; cursor:pointer;">كناشة</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- إضافة كتاب جديد ---
function addNewBook() {
    let t = prompt("اسم الكتاب يا بطل؟");
    let l = prompt("رابط الـ PDF؟");
    let c = prompt("رابط صورة الغلاف (اختياري)؟");
    if (t && l) {
        let s = JSON.parse(localStorage.getItem('myBooks')) || [];
        s.push({ title: t, link: l, cover: c, rank: 0, note: "" });
        localStorage.setItem('myBooks', JSON.stringify(s));
        loadBooks();
        updateAchievement();
    }
}

// --- نظام الملاحظات والكناشة ---
function openNotes(index) {
    currentBookIndex = index;
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    const book = saved[index];
    document.getElementById('notes-section').style.display = 'block';
    document.getElementById('note-book-title').innerText = book.title;
    document.getElementById('book-note-input').value = book.note || "";
}

function saveNote() {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    saved[currentBookIndex].note = document.getElementById('book-note-input').value;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    alert("انحفظت الفائدة بالكناشة! ✨");
}

// --- تصدير البطاقة كصورة (الميزة الجديدة) ---
function shareAsImage() {
    const noteText = document.getElementById('book-note-input').value;
    const bookTitle = document.getElementById('note-book-title').innerText;

    if (!noteText) { alert("اكتب شي فائدة بالأول! ✍️"); return; }

    document.getElementById('quote-text-display').innerText = `"${noteText}"`;
    document.getElementById('quote-book-source').innerText = `— من كتاب: ${bookTitle}`;

    const template = document.getElementById('quote-template');
    html2canvas(template).then(canvas => {
        const link = document.createElement('a');
        link.download = `تبيان - ${bookTitle}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
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
    if(confirm("بدك تحذف الكتاب؟")) {
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
    document.getElementById('progress-bar').style.width = ((read / (saved.length || 1)) * 100) + "%";
    document.getElementById('achievement-text').innerText = `أنجزت ${read} من ${saved.length} كتب.`;
}
