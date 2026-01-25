// مكتبة الأجواء (تفاعل الطبيعة)
const moodLibrary = {
    "مقدمة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "غابة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    "بحر": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "رعب": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
};

let naturePlayer = new Audio();
naturePlayer.loop = true;
let readingStartTime;

window.onload = () => { loadBooks(); };

// دالة التنقل
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.getElementById(pageId).classList.add('active-page');
}

// محرك البحث والكتب
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
            
            // نظام التقييم التلقائي (الأكثر قراءة)
            if (book.rank > 5) {
                trendingGrid.appendChild(createCard(book, index));
            }
        }
    });
}

function createCard(book, index) {
    const div = document.createElement('div');
    div.style = "min-width:140px; max-width:140px; background:white; padding:10px; border-radius:10px; text-align:center; position:relative; flex-shrink:0; box-shadow:0 2px 5px rgba(0,0,0,0.1);";
    div.innerHTML = `
        <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; background:red; color:white; border:none; border-radius:50%; cursor:pointer; width:20px; height:20px; z-index:10;">X</button>
        <img src="${book.cover}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
        <h4 style="font-size:12px; height:30px; overflow:hidden; margin:5px 0;">${book.title}</h4>
        <button onclick="openBook(${index})" style="background:#3e2723; color:white; border:none; padding:8px; border-radius:5px; width:100%; cursor:pointer; font-size:11px;">قراءة واستماع ✨</button>
    `;
    return div;
}

// تكنولوجيا التقييم التلقائي بالوقت
function openBook(index) {
    readingStartTime = Date.now();
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    window.open(saved[index].link, '_blank');
    
    // محاكاة لزيادة التقييم بعد العودة
    setTimeout(() => {
        saved[index].rank = (saved[index].rank || 0) + 1;
        localStorage.setItem('myBooks', JSON.stringify(saved));
        loadBooks();
    }, 2000);

    openChapterEngine(saved[index].title);
}

function searchBooks() {
    loadBooks(document.getElementById('bookSearch').value);
}

// محرك الفصول والتلخيص
function openChapterEngine(title) {
    const list = document.getElementById('chapters-list');
    list.innerHTML = '';
    const mockChapters = [
        { name: "مقدمة هادئة", mood: "مقدمة" },
        { name: "فصل الغابة", mood: "غابة" },
        { name: "أصوات البحر", mood: "بحر" }
    ];
    mockChapters.forEach(ch => {
        const btn = document.createElement('button');
        btn.innerText = ch.name;
        btn.onclick = () => playChapter(ch);
        list.appendChild(btn);
    });
    document.getElementById('audio-status').innerText = "تم تقسيم فصول: " + title;
}

function playChapter(chapter) {
    document.getElementById('current-chapter').innerHTML = `${chapter.name} <button onclick="getSummary('${chapter.name}')" style="background:#3498db; color:white; border:none; border-radius:5px; font-size:10px; cursor:pointer; padding:2px 5px;">لخّص ⚡</button>`;
    if (moodLibrary[chapter.mood]) {
        naturePlayer.src = moodLibrary[chapter.mood];
        naturePlayer.play();
        document.getElementById('natureBtn').innerText = "الجو الحالي: " + chapter.mood;
    }
}

function getSummary(chName) {
    document.getElementById('summary-area').style.display = 'block';
    document.getElementById('summary-text').innerText = `ملخص ذكي لـ (${chName}): هذا الفصل يحتوي على أهم الأفكار بأسلوب مختصر ومفيد أعده لك المحرك الصوتي.`;
}

function exportSummary() {
    const blob = new Blob([document.getElementById('summary-text').innerText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.download = "summary_ahmed.txt";
    a.href = window.URL.createObjectURL(blob);
    a.click();
}

function closeSummary() { document.getElementById('summary-area').style.display = 'none'; }

function toggleNature() {
    if (naturePlayer.paused) naturePlayer.play();
    else naturePlayer.pause();
}

function addNewBook() {
    let title = prompt("اسم الكتاب؟");
    let link = prompt("رابط الـ PDF:");
    let cover = prompt("رابط الصورة:");
    if (title && link) {
        const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
        saved.push({ title, link, cover: cover || 'https://placehold.co/100x150?text=Book', rank: 0 });
        localStorage.setItem('myBooks', JSON.stringify(saved));
        loadBooks();
    }
}

function deleteBook(index) {
    if(confirm("حيزوم، متأكد من الحذف؟")) {
        let saved = JSON.parse(localStorage.getItem('myBooks'));
        saved.splice(index, 1);
        localStorage.setItem('myBooks', JSON.stringify(saved));
        loadBooks();
    }
}
