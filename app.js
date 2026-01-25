const moodLibrary = { "مقدمة": "URL_1", "غابة": "URL_2", "بحر": "URL_3" };
let naturePlayer = new Audio(); naturePlayer.loop = true;

window.onload = () => { loadBooks(); updateAchievement(); setDailyChallenge(); };

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
    document.getElementById('challenge-task').innerText = `تحدي اليوم: قراءة 5 دقائق من "${daily.title}"`;
    document.getElementById('challenge-btn').onclick = () => window.open(daily.link, '_blank');
}

function updateAchievement() {
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    const read = saved.filter(b => b.rank > 0).length;
    const percent = (read / (saved.length || 1)) * 100;
    document.getElementById('progress-bar').style.width = percent + "%";
    document.getElementById('achievement-text').innerText = `أنجزت ${read} من ${saved.length} كتب.`;
}

function loadBooks(filter = "") {
    const grid = document.getElementById('booksGrid'); grid.innerHTML = '';
    const saved = JSON.parse(localStorage.getItem('myBooks')) || [];
    saved.forEach((book, index) => {
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
            const card = document.createElement('div');
            card.style = "min-width:140px; background:white; padding:10px; border-radius:10px; text-align:center; position:relative; flex-shrink:0;";
            card.innerHTML = `
                <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;">X</button>
                <img src="${book.cover}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
                <h4 style="font-size:12px; height:30px; overflow:hidden; margin:5px 0;">${book.title}</h4>
                <button onclick="openBook(${index})" style="background:#3e2723; color:white; border:none; padding:8px; border-radius:5px; width:100%; cursor:pointer;">قراءة ✨</button>
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
    loadBooks(); updateAchievement();
}

function addNewBook() {
    let t = prompt("الاسم؟"), l = prompt("الرابط؟"), c = prompt("الغلاف؟");
    if (t && l) {
        let s = JSON.parse(localStorage.getItem('myBooks')) || [];
        s.push({ title: t, link: l, cover: c || 'https://via.placeholder.com/150', rank: 0 });
        localStorage.setItem('myBooks', JSON.stringify(s)); loadBooks(); updateAchievement();
    }
}

function deleteBook(i) { if(confirm("حيزوم، متأكد؟")) { let s = JSON.parse(localStorage.getItem('myBooks')); s.splice(i, 1); localStorage.setItem('myBooks', JSON.stringify(s)); loadBooks(); updateAchievement(); } }
function searchBooks() { loadBooks(document.getElementById('bookSearch').value); }
function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page')); document.getElementById(id).classList.add('active-page'); }
function toggleNature() { naturePlayer.paused ? naturePlayer.play() : naturePlayer.pause(); }
