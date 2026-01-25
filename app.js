let db = JSON.parse(localStorage.getItem('tibyan_db')) || [
    { title: "مقدمة ابن خلدون", cover: "https://via.placeholder.com/150/3E2723/white?text=Tibyan", fav: false },
    { title: "تفسير الجلالين", cover: "https://via.placeholder.com/150/D4AF37/white?text=Tibyan", fav: false }
];

function showPage(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
}

function render(data = db, target = 'mainGrid') {
    const grid = document.getElementById(target);
    grid.innerHTML = '';
    data.forEach((book, i) => {
        grid.innerHTML += `
            <div class="book-card">
                <img src="${book.cover}">
                <h4 style="font-size:13px; margin:10px 0;">${book.title}</h4>
                <button onclick="openAudio('${book.title}')" style="background:var(--brown); color:white; border:none; padding:5px 10px; border-radius:5px; font-size:10px;">استماع</button>
                <button onclick="toggleFav(${i})" style="background:none; border:none; color:red; margin-top:5px;">
                    <i class="${book.fav ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
        `;
    });
}

function liveSearch() {
    const q = document.getElementById('mainSearch').value.toLowerCase();
    render(db.filter(b => b.title.toLowerCase().includes(q)));
}

function toggleFav(i) {
    db[i].fav = !db[i].fav;
    localStorage.setItem('tibyan_db', JSON.stringify(db));
    render();
    render(db.filter(b => b.fav), 'mylistGrid');
}

function openAudio(title) {
    document.getElementById('audio-title').innerText = title;
    document.getElementById('audio-console').style.display = 'block';
}

function closeAudio() { document.getElementById('audio-console').style.display = 'none'; }

function addNewBook() {
    const t = prompt("عنوان الكتاب؟");
    if(t) {
        db.push({ title: t, cover: "https://via.placeholder.com/150/3E2723/white?text="+t, fav: false });
        localStorage.setItem('tibyan_db', JSON.stringify(db));
        render();
    }
}

window.onload = () => { render(); render(db.filter(b => b.fav), 'mylistGrid'); };
