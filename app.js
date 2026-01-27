// استعادة قاعدة البيانات والميزات
let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { id: 1, title: "زاد المعاد", author: "ابن القيم", status: "reading", fav: true }
];

window.onload = () => {
    // 1. استعادة كلمة اليوم
    const savedQuote = localStorage.getItem('daily_quote') || "بوابة العلم والتحصيل";
    document.getElementById('dailyQuoteDisplay').innerText = `"${savedQuote}"`;
    
    // 2. تحديث الواجهات
    refreshHome();
    updateStats();
    
    // 3. إنهاء شاشة الافتتاحية
    setTimeout(() => {
        document.getElementById("splash").style.opacity = '0';
        setTimeout(() => document.getElementById("splash").style.display = "none", 1000);
    }, 4000);
};

// التنقل وإصلاح الأزرار
function showPage(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(id).classList.add('active-section');
    btn.classList.add('active');
    if(id === 'mylist') filterBooks('reading', document.querySelector('.tab-btn'));
}

// كلمة السر "heizoum" لفتح المالك
function liveSearch() {
    const q = document.getElementById('searchField').value.trim().toLowerCase();
    if (q === 'heizoum') {
        document.getElementById('ownerNavBtn').style.display = 'flex';
        alert("أهلاً يا كحيلان 🛡️ تم تفعيل صلاحيات المالك");
        document.getElementById('searchField').value = '';
    }
}

// تحديث كلمة اليوم (ميزة المالك)
function updateDailyQuote() {
    const q = document.getElementById('newQuote').value;
    if(q) {
        localStorage.setItem('daily_quote', q);
        document.getElementById('dailyQuoteDisplay').innerText = `"${q}"`;
        alert("تم تحديث الحكمة بنجاح ✨");
        document.getElementById('newQuote').value = '';
    }
}

// نظام الورد اليومي
function updateWard() {
    let p = document.getElementById('pageInput').value || 0;
    document.getElementById('wardFill').style.width = Math.min(100, (p/20*100)) + '%';
    alert("واصل القراءة يا حيزوم! 🚀");
}

function refreshHome() {
    renderGrid('mainGrid', db);
    renderGrid('recentGrid', db.slice(-3));
}

function renderGrid(id, data) {
    const container = document.getElementById(id);
    if(container) {
        container.innerHTML = data.map(b => `
            <div class="glass-card" style="margin:0; text-align:center; padding:12px;">
                <b class="royal-font">${b.title}</b><br><small>${b.author}</small>
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
        db.push({ id: Date.now(), title: t, author: a, status: 'reading', fav: false });
        localStorage.setItem('tibyan_db', JSON.stringify(db));
        refreshHome(); updateStats();
        alert("تم النشر في مكتبة تبيان! 🚀");
    }
}

function saveNotes() {
    localStorage.setItem('user_notes', document.getElementById('userNotes').value);
    alert("تم حفظ الملاحظات بنجاح 💾");
}
