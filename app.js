// قاعدة بيانات محلية
let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { id: 1, title: "زاد المعاد", author: "ابن القيم", status: "reading" },
    { id: 2, title: "رياض الصالحين", author: "النووي", status: "completed" }
];

window.onload = () => {
    // تحميل حكمة اليوم المخزنة
    const savedQuote = localStorage.getItem('daily_quote') || "بوابة العلم والتحصيل";
    document.getElementById('dailyQuoteDisplay').innerText = `"${savedQuote}"`;
    
    renderGrid('mainGrid', db);
    updateStats();

    // إخفاء الـ Splash
    setTimeout(() => {
        const splash = document.getElementById("splash");
        splash.style.opacity = '0';
        setTimeout(() => splash.style.display = "none", 1000);
    }, 4000);
};

// التنقل الذكي بين الصفحات (إصلاح الأزرار)
function showPage(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    
    document.getElementById(id).classList.add('active-section');
    btn.classList.add('active');
}

// حركة حيزوم السرية (البحث)
function liveSearch() {
    const q = document.getElementById('searchField').value.trim().toLowerCase();
    if (q === 'heizoum') {
        document.getElementById('ownerNavBtn').style.display = 'flex';
        alert("أهلاً يا كحيلان 🛡️ تم فتح لوحة المالك");
        document.getElementById('searchField').value = '';
    }
}

// تحديث كلمة اليوم من لوحة المالك
function updateDailyQuote() {
    const q = document.getElementById('newQuote').value;
    if(q) {
        localStorage.setItem('daily_quote', q);
        document.getElementById('dailyQuoteDisplay').innerText = `"${q}"`;
        alert("تم تحديث الكلمة بنجاح يا معلم ✨");
        document.getElementById('newQuote').value = '';
    }
}

// الورد اليومي
function updateWard() {
    let p = document.getElementById('pageInput').value || 0;
    document.getElementById('wardFill').style.width = Math.min(100, (p/20*100)) + '%';
    alert("استمر يا حيزوم! تم تحديث الورد 🚀");
}

function renderGrid(id, data) {
    const container = document.getElementById(id);
    if(container) {
        container.innerHTML = data.map(b => `
            <div class="glass-card" style="margin:0; text-align:center; padding:10px;">
                <b class="royal-font">${b.title}</b><br>
                <small>${b.author}</small>
            </div>
        `).join('');
    }
}

function updateStats() {
    document.getElementById('statTotal').innerText = db.length;
    document.getElementById('statDone').innerText = db.filter(b => b.status === 'completed').length;
}

function publishBook() {
    const t = document.getElementById('ownerT').value;
    const a = document.getElementById('ownerA').value;
    if(t && a) {
        db.push({ id: Date.now(), title: t, author: a, status: 'reading' });
        localStorage.setItem('tibyan_db', JSON.stringify(db));
        renderGrid('mainGrid', db);
        updateStats();
        alert("تم النشر في تبيان! 🚀");
        document.getElementById('ownerT').value = '';
        document.getElementById('ownerA').value = '';
    }
}
