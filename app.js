// ميزة أصوات الطبيعة التلقائية
let natureAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'); // مثال لصوت مطر
natureAudio.loop = true;

function toggleNatureSounds() {
    const btn = document.getElementById('natureBtn');
    if (natureAudio.paused) {
        natureAudio.play();
        btn.innerText = "إيقاف الطبيعة 🌿";
        btn.style.background = "#e74c3c";
    } else {
        natureAudio.pause();
        btn.innerText = "صوت الطبيعة: مطر 🌧️";
        btn.style.background = "#27ae60";
    }
}

// تحميل الكتب (نفس ميزاتك السابقة مع تطوير العرض)
function loadBooks(filter = "") {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';
    const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];

    savedBooks.forEach((book, index) => {
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
            const card = document.createElement('div');
            card.style = "min-width:140px; background:white; padding:10px; border-radius:10px; text-align:center;";
            card.innerHTML = `
                <img src="${book.cover}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
                <h4 style="margin:5px 0; font-size:12px;">${book.title}</h4>
                <div style="display:flex; gap:5px;">
                    <button onclick="window.open('${book.link}')" style="background:#8d6e63; color:white; border:none; font-size:10px; padding:5px; border-radius:4px; flex:1;">قراءة</button>
                    <button onclick="playAudio('${book.title}', 'رابط_صوتي_تجريبي')" style="background:#d4af37; color:white; border:none; font-size:10px; padding:5px; border-radius:4px; flex:1;">استماع</button>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

// دالة تشغيل الصوت
function playAudio(title, url) {
    const player = document.getElementById('main-player');
    const status = document.getElementById('audio-status');
    player.src = url;
    status.innerText = "جاري تشغيل: " + title;
    player.play();
}

// عند إضافة كتاب (الميزات الأساسية)
function addNewBook() {
    let title = prompt("اسم الكتاب؟");
    let link = prompt("رابط PDF (الاستيعاب الخارق):");
    let cover = prompt("رابط غلاف الكتاب:");
    
    if (title && link) {
        const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];
        savedBooks.push({ title, link, cover: cover || 'https://placehold.co/100x150?text=Book' });
        localStorage.setItem('myBooks', JSON.stringify(savedBooks));
        loadBooks();
    }
}

window.onload = loadBooks;
