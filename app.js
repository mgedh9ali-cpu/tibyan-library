let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { id: 1, title: "زاد المعاد", author: "ابن القيم", status: "reading", fav: true },
    { id: 2, title: "رياض الصالحين", author: "النووي", status: "completed", fav: false }
];

window.onload = () => {
    refreshHome();
    setTimeout(() => { document.getElementById("splash").style.display = "none"; }, 4000);
};

// حركة حيزوم السرية
function liveSearch() {
    const q = document.getElementById('searchField').value;
    if (q === 'heizoum') {
        document.getElementById('ownerNavBtn').style.display = 'flex';
        alert("أهلاً يا كحيلان! تم تفعيل لوحة المالك 👑");
        return;
    }
}

// التنقل بين القوائم
function nav(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(id).classList.add('active-section');
    btn.classList.add('active');
}

// الورد اليومي
function updateWard() {
    let p = document.getElementById('pageInput').value || 0;
    document.getElementById('wardFill').style.width = (p/20*100) + '%';
    alert("تم تحديث وردك اليومي بنجاح 🚀");
}

// تصفية الكتب
function filterBooks(status, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // هنا تضع كود عرض الكتب حسب الحالة
}

function publishBook() {
    alert("تم نشر الكتاب في المكتبة العامة بنجاح!");
}
