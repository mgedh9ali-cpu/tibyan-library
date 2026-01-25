// مكتبة الأجواء (السينما الصوتية)
const moodLibrary = {
    "مقدمة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "غابة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    "بحر": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "رعب": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
};

let naturePlayer = new Audio();
naturePlayer.loop = true;

// تشغيل الموقع
window.onload = () => { loadBooks(); };

// التنقل بين الصفحات
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.getElementById(pageId).classList.add('active-page');
}

// محرك الكتب
function loadBooks(filter = "") {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';
    const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];

    savedBooks.forEach((book, index) => {
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
            const card = document.createElement('div');
            card.style = "min-width:140px; max-width:140px; background:white; padding:10px; border-radius:10px; text-align:center; position:relative; flex-shrink:0;";
            card.innerHTML = `
                <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; background:red; color:white; border:none; border-radius:50%; cursor:pointer; width:20px; height:20px;">X</button>
                <img src="${book.cover}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
                <h4 style="font-size:12px; height:30px; overflow:hidden; margin:5px 0;">${book.title}</h4>
                <button onclick="openChapterEngine('${book.title}')" style="background:#3e2723; color:white; border:none; padding:8px; border-radius:5px; width:100%; cursor:pointer; font-size:11px;">فتح الفصول ✨</button>
            `;
            grid.appendChild(card);
        }
    });
}

function addNewBook() {
    let title = prompt("اسم الكتاب؟");
    let link = prompt("رابط الـ PDF:");
    let cover = prompt("رابط الغلاف:");
    if (title && link) {
        const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
        saved.push({ title, link, cover: cover || 'https://placehold.co/100x150?text=Book' });
        localStorage.setItem('myBooks', JSON.stringify(saved));
        loadBooks();
    }
}

function deleteBook(index) {
    if(confirm("يا حيزوم، متأكد؟")) {
        let saved = JSON.parse(localStorage.getItem('myBooks'));
        saved.splice(index, 1);
        localStorage.setItem('myBooks', JSON.stringify(saved));
        loadBooks();
    }
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
        { name: "عاصفة بحرية", mood: "بحر" }
    ];
    mockChapters.forEach(ch => {
        const btn = document.createElement('button');
        btn.innerText = ch.name;
        btn.onclick = () => playChapter(ch);
        list.appendChild(btn);
    });
    document.getElementById('audio-status').innerText = "تم فتح فصول: " + title;
}

function playChapter(chapter) {
    document.getElementById('current-chapter').innerHTML = `${chapter.name} <button onclick="getSummary('${chapter.name}')" style="background:#3498db; color:white; border:none; border-radius:5px; font-size:10px; cursor:pointer; padding:2px 5px;">لخّص ⚡</button>`;
    if (moodLibrary[chapter.mood]) {
        naturePlayer.src = moodLibrary[chapter.mood];
        naturePlayer.play();
        document.getElementById('natureBtn').innerText = "الجو: " + chapter.mood;
    }
}

function getSummary(chName) {
    const area = document.getElementById('summary-area');
    area.style.display = 'block';
    document.getElementById('summary-text').innerText = `زبدة ${chName}: هذا الفصل يركز على الهدوء والذكاء في التعامل مع الأحداث المحيطة، وهو ملخص مقدم من محرك تبيان.`;
}

function exportSummary() {
    const blob = new Blob([document.getElementById('summary-text').innerText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.download = "tibyan_summary.txt";
    a.href = window.URL.createObjectURL(blob);
    a.click();
}

function closeSummary() { document.getElementById('summary-area').style.display = 'none'; }
