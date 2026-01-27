let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { id: 1, title: "زاد المعاد", author: "ابن القيم", status: "reading" }
];

window.onload = () => {
    // استعادة الحكمة اليومية
    const savedQuote = localStorage.getItem('daily_quote') || "بوابة العلم والتحصيل";
    document.getElementById('dailyQuoteDisplay').innerText = `"${savedQuote}"`;
    
    renderGrid('mainGrid', db);
    setTimeout(() => { document.getElementById("splash").style.display = "none"; }, 4000);
};

// وظيفة التنقل بين الصفحات (إصلاح الأزرار)
function showPage(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(id).classList.add('active-section');
    btn.classList.add('active');
}

// حركة حيزوم السرية
function liveSearch() {
    const q = document.getElementById('searchField').value.trim().toLowerCase();
    if (q === 'heizoum') {
        document.getElementById('ownerNavBtn').style.display = 'flex';
        alert("أهلاً يا كحيلان 🛡️");
    }
}

// تحديث حكمة اليوم من لوحة المالك
function updateDailyQuote() {
    const q = document.getElementById('newQuote').value;
    if(q) {
        localStorage.setItem('daily_quote', q);
        document.getElementById('dailyQuoteDisplay').innerText = `"${q}"`;
        alert("تم تحديث الكلمة اليومية بنجاح! ✨");
    }
}

function renderGrid(id, data) {
    const container = document.getElementById(id);
    if(container) {
        container.innerHTML = data.map(b => `<div class="glass-card" style="margin:0; text-align:center;"><b>${b.title}</b><br><small>${b.author}</small></div>`).join('');
    }
}

function publishBook() {
    const t = document.getElementById('ownerT').value;
    const a = document.getElementById('ownerA').value;
    if(t && a) {
        db.push({id: Date.now(), title: t, author: a, status: 'reading'});
        localStorage.setItem('tibyan_db', JSON.stringify(db));
        renderGrid('mainGrid', db);
        alert("نُشر الكتاب! 🚀");
    }
}
