// --- إعدادات السينما الصوتية ---
let natureAudio = new Audio();
natureAudio.loop = true;
let currentBookIndex = null;

const sounds = {
    rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 
    forest: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    library: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
};

window.onload = () => {
    loadBooks();
    updateAchievement();
};

// --- عرض الكتب الموحد ---
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
            <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; background:#e74c3c; color:white; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-size:10px; z-index:10;">X</button>
            <img src="${book.cover || 'https://via.placeholder.com/150x200?text=Tibyan'}">
            <h4 style="font-size:13px; margin:10px 0; height:32px; overflow:hidden;">${book.title}</h4>
            <div style="display:flex; gap:5px;">
                <button onclick="openBook(${index})" style="background:#3e2723; color:white; border:none; padding:8px; border-radius:5px; flex:1; cursor:pointer; font-size:12px;">قراءة</button>
                <button onclick="openNotes(${index})" style="background:#d4af37; color:white; border:none; padding:8px; border-radius:5px; flex:1; cursor:pointer; font-size:12px;">كناشة</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- إضافة كتاب جديد ---
function addNewBook() {
    let t = prompt("اسم الكتاب؟");
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

// --- الكناشة والبطاقات ---
function openNotes(index) {
    currentBookIndex = index;
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    document.getElementById('notes-section').style.display = 'block';
    document.getElementById('note-book-title').innerText = saved[index].title;
    document.getElementById('book-note-input').value = saved[index].note || "";
}

function saveNote() {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    saved[currentBookIndex].note = document.getElementById('book-note-input').value;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    alert("انحفظت الفائدة! ✨");
}

function shareAsImage() {
    const noteText = document.getElementById('book-note-input').value;
    const bookTitle = document.getElementById('note-book-title').innerText;
    if (!noteText) { alert("اكتب فائدة أولاً! ✍️"); return; }

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

// --- التحكم بالصوتيات ---
function toggleControl(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
}

function changeNature(type) {
    natureAudio.src = sounds[type];
    natureAudio.play();
}

function stopNature() { natureAudio.pause(); }
function adjustVolume() { natureAudio.volume = document.getElementById('volumeControl').value; }

// --- وظائف عامة ---
function openBook(index) {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    saved[index].rank = (saved[index].rank || 0) + 1;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    window.open(saved[index].link, '_blank');
    updateAchievement();
}

function deleteBook(i) {
    if(confirm("حذف الكتاب؟")) {
        let s = JSON.parse(localStorage.getItem('myBooks'));
        s.splice(i, 1);
        localStorage.setItem('myBooks', JSON.stringify(s));
        loadBooks();
        updateAchievement();
    }
}

function searchBooks() { loadBooks(document.getElementById('bookSearch').value); }

function updateAchievement() {
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    const read = saved.filter(b => b.rank > 0).length;
    document.getElementById('progress-bar').style.width = ((read / (saved.length || 1)) * 100) + "%";
    document.getElementById('achievement-text').innerText = `أنجزت ${read} من ${saved.length} كتب.`;
}
