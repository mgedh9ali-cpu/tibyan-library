// 1. قاعدة البيانات (مدموج فيها الملفات وروابط العينة)
let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { 
        id: 1, 
        title: "زاد المعاد", 
        author: "ابن القيم", 
        cover: "https://via.placeholder.com/200x300/3E2723/white?text=زاد+المعاد", 
        status: "reading", 
        sample: "books/zad_sample.pdf", // رابط افتراضي للعينة
        file: "books/zad_full.pdf"      // رابط افتراضي للكتاب الكامل
    },
    { 
        id: 2, 
        title: "رياض الصالحين", 
        author: "النووي", 
        cover: "https://via.placeholder.com/200x300/D4AF37/white?text=رياض+الصالحين", 
        status: "completed",
        sample: "books/sample.pdf",
        file: "books/full.pdf"
    }
];

// المتغيرات العالمية للقارئ والصوت
let currentBook = null;
let audio = new Audio();
audio.loop = true;
audio.volume = 0.5;

// مسارات الأصوات (يجب أن تكون الملفات موجودة في مجلد sounds)
const sounds = {
    warraq: 'sounds/warraq.mp3',
    night: 'sounds/night_reader.mp3',
    researcher: 'sounds/researcher.mp3',
    friend: 'sounds/friend.mp3'
};

window.onload = () => {
    // استعادة حكمة اليوم
    const savedQuote = localStorage.getItem('daily_quote') || "بوابة العلم والتحصيل";
    document.getElementById('dailyQuoteDisplay').innerText = `"${savedQuote}"`;
    
    // تحديث الواجهات
    refreshHome();
    updateStats();
    
    // إخفاء شاشة البداية
    setTimeout(() => {
        const splash = document.getElementById("splash");
        splash.style.opacity = '0';
        setTimeout(() => splash.style.display = "none", 1000);
    }, 4000);
};

/* ================= إدارة التنقل والواجهات ================= */

function nav(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(id).classList.add('active-section');
    if(btn) btn.classList.add('active');
    
    if(id === 'mylist') filterMyList('reading', document.querySelector('.tab-btn'));
}

function refreshHome() {
    renderGrid('mainGrid', db);
    // آخر 3 كتب مضافة
    renderGrid('recentGrid', db.slice(-3));
}

function renderGrid(targetId, data) {
    const container = document.getElementById(targetId);
    if(container) {
        container.innerHTML = data.map(b => `
            <div class="book-card" onclick="openReader(${b.id})">
                <img src="${b.cover}">
                <h4 class="royal-font" style="margin:5px 0; font-size:14px;">${b.title}</h4>
                <small style="color:#888;">${b.author}</small>
            </div>
        `).join('');
    }
}

/* ================= البحث ولوحة المالك (Heizoum) ================= */

function liveSearch() {
    const q = document.getElementById('searchField').value.trim().toLowerCase();
    
    // الكود السري
    if (q === 'heizoum') {
        document.getElementById('ownerNavBtn').style.display = 'flex';
        alert("🛡️ أهلاً حيزوم! تم تفعيل لوحة المالك");
        document.getElementById('searchField').value = '';
        return;
    }

    // البحث العادي
    if(q.length > 0) {
        const filtered = db.filter(b => b.title.includes(q) || b.author.includes(q));
        renderGrid('mainGrid', filtered);
    } else {
        refreshHome();
    }
}

/* ================= قارئ الكتب المدمج (The Reader) ================= */

function openReader(bookId) {
    const book = db.find(b => b.id === bookId);
    if(!book) return;

    currentBook = book;
    document.getElementById('readerTitle').innerText = book.title;
    
    // البدء بالعينة افتراضياً
    document.getElementById('bookFrame').src = book.sample || ""; 
    
    // إظهار طبقة القارئ
    document.getElementById('readerView').classList.remove('hidden');
}

function closeReader() {
    document.getElementById('readerView').classList.add('hidden');
    audio.pause(); // إيقاف الصوت عند الخروج
    currentBook = null;
}

function openSample() {
    if(currentBook) document.getElementById('bookFrame').src = currentBook.sample || "";
}

function openFull() {
    if(currentBook) document.getElementById('bookFrame').src = currentBook.file || "";
}

function addToMyListFromReader() {
    if(currentBook) {
        currentBook.status = 'reading';
        saveData();
        alert("✅ تمت الإضافة لقائمتك");
    }
}

/* ================= الأصوات والتلخيص ================= */

function selectSound(type) {
    audio.src = sounds[type];
    audio.play();
}

function toggleSound() {
    if(audio.paused) audio.play();
    else audio.pause();
}

function setVolume(val) {
    audio.volume = val;
}

function textSummary() {
    alert("📝 التلخيص الورقي:\nيعرض هذا الكتاب الأفكار الأساسية بأسلوب منهجي وميسر.");
}

function audioSummary() {
    const msg = new SpeechSynthesisUtterance("هذا ملخص صوتي سريع لأهم أفكار الكتاب.");
    msg.lang = 'ar';
    speechSynthesis.speak(msg);
}

/* ================= إدارة القوائم والبيانات (الميزات القديمة) ================= */

function updateWard() {
    let p = document.getElementById('pageInput').value || 0;
    let percent = Math.min(100, (p/20)*100);
    document.getElementById('wardFill').style.width = percent + '%';
    alert("🚀 تم تحديث الورد اليومي!");
}

function filterMyList(status, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filtered = db.filter(b => b.status === status);
    renderGrid('listGrid', filtered);
    
    // تحديث قائمة المؤلفين
    const authors = [...new Set(db.map(b => b.author))];
    document.getElementById('authorsList').innerHTML = authors.map(a => `<span style="background:#eee; padding:5px 10px; border-radius:15px; font-size:12px; margin:2px;">${a}</span>`).join('');
}

function updateDailyQuote() {
    const q = document.getElementById('newQuote').value;
    if(q) {
        localStorage.setItem('daily_quote', q);
        document.getElementById('dailyQuoteDisplay').innerText = `"${q}"`;
        alert("✨ تم تحديث الحكمة");
    }
}

function publishBook() {
    const t = document.getElementById('ownerT').value;
    const a = document.getElementById('ownerA').value;
    const s = document.getElementById('ownerSample').value;
    const f = document.getElementById('ownerFull').value;

    if(t && a) {
        db.push({ 
            id: Date.now(), 
            title: t, 
            author: a, 
            cover: "https://via.placeholder.com/200x300", // غلاف افتراضي
            status: 'reading',
            sample: s || "books/sample.pdf",
            file: f || "books/full.pdf"
        });
        saveData();
        refreshHome();
        updateStats();
        alert("🚀 تم النشر بنجاح!");
    }
}

function saveNotes() {
    localStorage.setItem('user_notes', document.getElementById('userNotes').value);
    alert("💾 تم حفظ الملاحظات");
}

function updateStats() {
    document.getElementById('statTotal').innerText = db.length;
    document.getElementById('statDone').innerText = db.filter(b => b.status === 'completed').length;
}

function saveData() {
    localStorage.setItem('tibyan_db', JSON.stringify(db));
}
