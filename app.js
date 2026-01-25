let currentBookIndex = null;
let naturePlayer = new Audio(); naturePlayer.loop = true;
const moodLibrary = { "مقدمة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", "هدوء": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" };

window.onload = () => { loadBooks(); updateAchievement(); setDailyChallenge(); };

// --- البحث والعرض مع التصنيف ---
function loadBooks(filter = "", category = "") {
    const grid = document.getElementById('booksGrid'); grid.innerHTML = '';
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    
    saved.forEach((book, index) => {
        const matchesSearch = book.title.toLowerCase().includes(filter.toLowerCase());
        const matchesCategory = category === "" || book.category === category;

        if (matchesSearch && matchesCategory) {
            const card = document.createElement('div');
            card.style = "min-width:140px; background:white; padding:10px; border-radius:10px; text-align:center; position:relative; flex-shrink:0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
            card.innerHTML = `
                <span style="position:absolute; top:5px; right:5px; background:#d4af37; color:white; font-size:8px; padding:2px 5px; border-radius:5px;">${book.category || 'عام'}</span>
                <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; background:red; color:white; border:none; border-radius:50%; width:18px; height:18px; cursor:pointer; font-size:10px;">X</button>
                <img src="${book.cover}" style="width:100%; height:160px; object-fit:cover; border-radius:8px;">
                <h4 style="font-size:11px; height:25px; overflow:hidden; margin:5px 0;">${book.title}</h4>
                <div style="display:flex; gap:3px;">
                    <button onclick="openBook(${index})" style="background:#3e2723; color:white; border:none; padding:5px; border-radius:5px; flex:1; cursor:pointer; font-size:10px;">قراءة</button>
                    <button onclick="openNotes(${index})" style="background:#d4af37; color:white; border:none; padding:5px; border-radius:5px; flex:1; cursor:pointer; font-size:10px;">كناشة</button>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

// --- إضافة كتاب جديد مع تصنيف ---
function addNewBook() {
    let t = prompt("اسم الكتاب؟"), l = prompt("رابط PDF؟"), c = prompt("رابط الغلاف؟"), cat = prompt("التصنيف (شرعي، علمي، تقني)؟") || "عام";
    if (t && l) {
        let s = JSON.parse(localStorage.getItem('myBooks')) || [];
        s.push({ title: t, link: l, cover: c || 'https://via.placeholder.com/150', category: cat, rank: 0, note: "" });
        localStorage.setItem('myBooks', JSON.stringify(s)); 
        loadBooks(); updateAchievement();
    }
}

// --- الكناشة (الملاحظات) ---
function openNotes(index) {
    currentBookIndex = index;
    const book = JSON.parse(localStorage.getItem('myBooks'))[index];
    document.getElementById('notes-section').style.display = 'block';
    document.getElementById('note-book-title').innerText = book.title;
    document.getElementById('book-note-input').value = book.note || "";
}

function saveNote() {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    saved[currentBookIndex].note = document.getElementById('book-note-input').value;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    alert("تم الحفظ في كناشة حيزوم! 📌");
}

// --- تحدي اليوم ---
function setDailyChallenge() {
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    if (saved.length === 0) return;
    const daily = saved[Math.floor(Math.random() * saved.length)];
    document.getElementById('daily-challenge').style.display = 'block';
    document.getElementById('challenge-task').innerText = `تحديك اليوم: ${daily.title}`;
    document.getElementById('challenge-btn').onclick = () => window.open(daily.link, '_blank');
}

// --- الإنجاز والصوتيات والدوال الأخرى ---
function updateAchievement() {
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    const read = saved.filter(b => b.rank > 0).length;
    document.getElementById('progress-bar').style.width = ((read / (saved.length || 1)) * 100) + "%";
    document.getElementById('achievement-text').innerText = `أنجزت ${read} من ${saved.length} كتب.`;
}

function openBook(index) {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    saved[index].rank = (saved[index].rank || 0) + 1;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    window.open(saved[index].link, '_blank');
    loadBooks(); updateAchievement();
}

function deleteBook(i) { if(confirm("متأكد من الحذف؟")) { let s = JSON.parse(localStorage.getItem('myBooks')); s.splice(i, 1); localStorage.setItem('myBooks', JSON.stringify(s)); loadBooks(); updateAchievement(); } }
function searchBooks() { loadBooks(document.getElementById('bookSearch').value); }
function toggleNature() { naturePlayer.paused ? naturePlayer.play() : naturePlayer.pause(); }
function exportLibrary() { const data = localStorage.getItem('myBooks'); const blob = new Blob([data], {type: 'application/json'}); const a = document.createElement('a'); a.download = 'tibyan_backup.json'; a.href = window.URL.createObjectURL(blob); a.click(); }
