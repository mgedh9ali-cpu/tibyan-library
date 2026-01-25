const moodLibrary = {
    "مقدمة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "غابة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    "بحر": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "رعب": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
};

let naturePlayer = new Audio();
naturePlayer.loop = true;

window.onload = () => { 
    loadBooks(); 
    checkLastReading(); // فحص آخر كتاب تمت قراءته
};

function checkLastReading() {
    const lastBook = JSON.parse(localStorage.getItem('lastReading'));
    if (lastBook) {
        document.getElementById('resume-alert').style.display = 'block';
        document.getElementById('last-book-name').innerText = lastBook.title;
    }
}

function resumeReading() {
    const lastBook = JSON.parse(localStorage.getItem('lastReading'));
    window.open(lastBook.link, '_blank');
    openChapterEngine(lastBook.title);
    closeResume();
}

function closeResume() {
    document.getElementById('resume-alert').style.display = 'none';
}

function openBook(index) {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    const selectedBook = saved[index];
    
    // حفظ كـ Bookmark
    localStorage.setItem('lastReading', JSON.stringify({
        title: selectedBook.title,
        link: selectedBook.link
    }));

    window.open(selectedBook.link, '_blank');
    
    // زيادة التقييم التلقائي
    saved[index].rank = (saved[index].rank || 0) + 1;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    loadBooks();
    openChapterEngine(selectedBook.title);
}

function loadBooks(filter = "") {
    const grid = document.getElementById('booksGrid');
    const trendingGrid = document.getElementById('trendingGrid');
    grid.innerHTML = '';
    trendingGrid.innerHTML = '';
    const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];

    savedBooks.forEach((book, index) => {
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
            const card = createCard(book, index);
            grid.appendChild(card);
            if (book.rank > 5) trendingGrid.appendChild(createCard(book, index));
        }
    });
}

function createCard(book, index) {
    const div = document.createElement('div');
    div.className = "book-card-item"; 
    div.style = "min-width:140px; background:white; padding:10px; border-radius:10px; text-align:center; position:relative; flex-shrink:0; box-shadow:0 2px 5px rgba(0,0,0,0.1);";
    div.innerHTML = `
        <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; z-index:10; cursor:pointer;">X</button>
        <img src="${book.cover}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
        <h4 style="font-size:12px; height:30px; overflow:hidden; margin:5px 0;">${book.title}</h4>
        <button onclick="openBook(${index})" style="background:#3e2723; color:white; border:none; padding:8px; border-radius:5px; width:100%; cursor:pointer; font-size:11px;">قراءة واستماع ✨</button>
    `;
    return div;
}

// بقية الدوال (Search, Chapter, Summary, Nature) تبقى كما هي لضمان الاستمرارية
function searchBooks() { loadBooks(document.getElementById('bookSearch').value); }
function openChapterEngine(title) {
    const list = document.getElementById('chapters-list');
    list.innerHTML = '';
    const mockChapters = [{ name: "مقدمة هادئة", mood: "مقدمة" }, { name: "فصل الغابة", mood: "غابة" }, { name: "أصوات البحر", mood: "بحر" }];
    mockChapters.forEach(ch => {
        const btn = document.createElement('button');
        btn.innerText = ch.name;
        btn.onclick = () => playChapter(ch);
        list.appendChild(btn);
    });
}
function playChapter(chapter) {
    document.getElementById('current-chapter').innerHTML = `${chapter.name} <button onclick="getSummary('${chapter.name}')" style="background:#3498db; color:white; border:none; border-radius:5px; font-size:10px; padding:2px 5px;">لخّص⚡</button>`;
    if (moodLibrary[chapter.mood]) { naturePlayer.src = moodLibrary[chapter.mood]; naturePlayer.play(); }
}
function getSummary(chName) {
    document.getElementById('summary-area').style.display = 'block';
    document.getElementById('summary-text').innerText = `ملخص ذكي لـ (${chName}): هذا الجزء من الكتاب يركز على الدروس المستفادة.`;
}
function exportSummary() {
    const blob = new Blob([document.getElementById('summary-text').innerText], { type: 'text/plain' });
    const a = document.createElement('a'); a.download = "summary.txt"; a.href = window.URL.createObjectURL(blob); a.click();
}
function closeSummary() { document.getElementById('summary-area').style.display = 'none'; }
function toggleNature() { naturePlayer.paused ? naturePlayer.play() : naturePlayer.pause(); }
function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page')); document.getElementById(id).classList.add('active-page'); }
function addNewBook() {
    let t = prompt("الاسم؟"), l = prompt("الرابط؟"), c = prompt("الصورة؟");
    if (t && l) {
        let s = JSON.parse(localStorage.getItem('myBooks')) || [];
        s.push({ title: t, link: l, cover: c || 'https://placehold.co/100x150', rank: 0 });
        localStorage.setItem('myBooks', JSON.stringify(s)); loadBooks();
    }
}
function deleteBook(i) { if(confirm("حيزوم، متأكد؟")) { let s = JSON.parse(localStorage.getItem('myBooks')); s.splice(i, 1); localStorage.setItem('myBooks', JSON.stringify(s)); loadBooks(); } }
