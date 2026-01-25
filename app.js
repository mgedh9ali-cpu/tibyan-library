const moodLibrary = {
    "مقدمة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "غابة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
};

let naturePlayer = new Audio();
naturePlayer.loop = true;

window.onload = () => { 
    loadBooks(); 
    checkLastReading(); 
    updateAchievement(); // تحديث شريط الإنجاز عند الفتح
};

// --- محرك الإنجازات ---
function updateAchievement() {
    const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];
    const readCount = savedBooks.filter(b => b.rank > 0).length; // نعتبر الكتاب مقروء إذا فُتح مرة واحدة
    const total = savedBooks.length || 1;
    const percentage = Math.min((readCount / total) * 100, 100);

    document.getElementById('progress-bar').style.width = percentage + "%";
    document.getElementById('achievement-text').innerText = 
        readCount === 0 ? "ابدأ القراءة الآن لتطوير مستواك!" : 
        `بطل يا حيزوم! أنجزت ${readCount} كتب من أصل ${total}. استمر! ✨`;
}

// --- بقية الدوال مع دمج التحديثات ---
function openBook(index) {
    const saved = JSON.parse(localStorage.getItem('myBooks'));
    localStorage.setItem('lastReading', JSON.stringify({
        title: saved[index].title,
        link: saved[index].link
    }));

    window.open(saved[index].link, '_blank');
    
    // زيادة الـ Rank لتفعيل شريط الإنجاز
    saved[index].rank = (saved[index].rank || 0) + 1;
    localStorage.setItem('myBooks', JSON.stringify(saved));
    
    loadBooks();
    updateAchievement(); // تحديث فوري للإنجاز
    openChapterEngine(saved[index].title);
}

function loadBooks(filter = "") {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';
    const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];

    savedBooks.forEach((book, index) => {
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
            const card = document.createElement('div');
            card.style = "min-width:140px; background:white; padding:10px; border-radius:10px; text-align:center; position:relative; flex-shrink:0; box-shadow:0 2px 5px rgba(0,0,0,0.1);";
            card.innerHTML = `
                <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;">X</button>
                <img src="${book.cover}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
                <h4 style="font-size:12px; height:30px; overflow:hidden; margin:5px 0;">${book.title}</h4>
                <button onclick="openBook(${index})" style="background:#3e2723; color:white; border:none; padding:8px; border-radius:5px; width:100%; cursor:pointer; font-size:11px;">قراءة واستماع ✨</button>
            `;
            grid.appendChild(card);
        }
    });
}

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
    closeResume();
}

function closeResume() { document.getElementById('resume-alert').style.display = 'none'; }
function searchBooks() { loadBooks(document.getElementById('bookSearch').value); }
function showPage(id) { 
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page')); 
    document.getElementById(id).classList.add('active-page'); 
}
function addNewBook() {
    let t = prompt("الاسم؟"), l = prompt("الرابط؟"), c = prompt("الصورة؟");
    if (t && l) {
        let s = JSON.parse(localStorage.getItem('myBooks')) || [];
        s.push({ title: t, link: l, cover: c || 'https://placehold.co/100x150', rank: 0 });
        localStorage.setItem('myBooks', JSON.stringify(s)); 
        loadBooks();
        updateAchievement();
    }
}
function deleteBook(i) { 
    if(confirm("حيزوم، متأكد؟")) { 
        let s = JSON.parse(localStorage.getItem('myBooks')); 
        s.splice(i, 1); 
        localStorage.setItem('myBooks', JSON.stringify(s)); 
        loadBooks(); 
        updateAchievement();
    } 
}
function openChapterEngine(title) {
    const list = document.getElementById('chapters-list');
    list.innerHTML = '';
    const mockChapters = [{ name: "المقدمة", mood: "مقدمة" }, { name: "فصل العلم", mood: "غابة" }];
    mockChapters.forEach(ch => {
        const btn = document.createElement('button');
        btn.innerText = ch.name;
        btn.onclick = () => { naturePlayer.src = moodLibrary[ch.mood]; naturePlayer.play(); };
        list.appendChild(btn);
    });
}
