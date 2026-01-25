// مكتبة الأجواء الدرامية (السينما الصوتية)
const moodLibrary = {
    "مقدمة": { bg: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", label: "هدوء 🕊️" },
    "غابة": { bg: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", label: "طبيعة 🌿" },
    "بحر": { bg: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", label: "موج 🌊" },
    "رعب": { bg: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", label: "تشويق 🔥" }
};

let naturePlayer = new Audio();
naturePlayer.loop = true;

// دالة محرك الفصول (التقسيم الآلي)
function splitBookIntoChapters(bookTitle) {
    const chaptersList = document.getElementById('chapters-list');
    chaptersList.innerHTML = ''; // تنظيف القائمة

    // محاكاة لتقسيم الكتاب (تكنولوجيا المسح)
    const mockChapters = [
        { id: 1, name: "المقدمة (هدوء)", mood: "مقدمة" },
        { id: 2, name: "فصل الغابة الخضراء", mood: "غابة" },
        { id: 3, name: "سر البحر العميق", mood: "بحر" },
        { id: 4, name: "مواجهة الرعب", mood: "رعب" }
    ];

    mockChapters.forEach(ch => {
        const btn = document.createElement('button');
        btn.innerText = ch.name;
        btn.style = "padding:8px 15px; background:#d4af37; color:white; border:none; border-radius:15px; white-space:nowrap; cursor:pointer; font-size:12px;";
        btn.onclick = () => playChapter(ch);
        chaptersList.appendChild(btn);
    });
}

function playChapter(chapter) {
    const status = document.getElementById('audio-status');
    const chTitle = document.getElementById('current-chapter');
    const natureBtn = document.getElementById('natureBtn');

    chTitle.innerText = chapter.name;
    status.innerText = "جاري تشغيل الفصل بصوت ذكي...";
    
    // تشغيل خلفية الطبيعة حسب "مود" الفصل تلقائياً
    if (moodLibrary[chapter.mood]) {
        naturePlayer.src = moodLibrary[chapter.mood].bg;
        naturePlayer.play();
        natureBtn.innerText = "الجو الحالي: " + moodLibrary[chapter.mood].label;
    }
}

// دمج الميزات الأساسية (تحميل، إضافة، حذف)
function loadBooks(filter = "") {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';
    const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];

    savedBooks.forEach((book, index) => {
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
            const card = document.createElement('div');
            card.style = "min-width:140px; max-width:140px; background:white; padding:10px; border-radius:10px; text-align:center; position:relative; flex-shrink:0;";
            card.innerHTML = `
                <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; border:none; background:red; color:white; border-radius:50%; width:20px; height:20px; cursor:pointer;">X</button>
                <img src="${book.cover}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
                <h4 style="margin:5px 0; font-size:12px; height:30px; overflow:hidden;">${book.title}</h4>
                <button onclick="splitBookIntoChapters('${book.title}')" style="background:#3e2723; color:white; border:none; padding:8px; border-radius:5px; width:100%; cursor:pointer; font-size:11px;">فتح الفصول ✨</button>
            `;
            grid.appendChild(card);
        }
    });
}

// نفس دوال الحذف والإضافة السابقة لضمان الاستمرارية...
function deleteBook(index) {
    if(confirm("يا حيزوم، متأكد من حذف الجوهرة؟")) {
        let saved = JSON.parse(localStorage.getItem('myBooks'));
        saved.splice(index, 1);
        localStorage.setItem('myBooks', JSON.stringify(saved));
        loadBooks();
    }
}

window.onload = loadBooks;
