window.onload = function() {
    loadBooks();
};

function loadBooks(filter = "", category = "الكل") {
    const grid = document.getElementById('booksGrid');
    const shelfTitle = document.getElementById('shelf-title');
    grid.innerHTML = ''; 
    shelfTitle.innerText = category === "الكل" ? "أحدث الكتب المضافة" : "قسم الـ " + category;

    const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];
    
    savedBooks.forEach((book, index) => {
        const matchesSearch = book.title.toLowerCase().includes(filter.toLowerCase());
        const matchesCategory = category === "الكل" || book.category === category;

        if (matchesSearch && matchesCategory) {
            displayBook(book, index);
        }
    });
}

function searchBooks() {
    const searchText = document.getElementById('bookSearch').value;
    loadBooks(searchText);
}

function addNewBook() {
    let title = prompt("اسم الكتاب؟");
    let category = prompt("تصنيف الكتاب (شرعي / علمي / أخرى):", "شرعي");
    let cover = prompt("رابط صورة الغلاف (اختياري):");
    let link = prompt("رابط الـ PDF:");
    
    if (title && link) {
        const finalCover = cover || `https://placehold.co/100x150/5d4037/white?text=${title}`;
        const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];
        savedBooks.push({ title, link, cover: finalCover, category: category });
        localStorage.setItem('myBooks', JSON.stringify(savedBooks));
        loadBooks();
        alert("انضاف الكتاب للقسم الصحيح! 🎉");
    }
}

function displayBook(book, index) {
    const grid = document.getElementById('booksGrid');
    const bookCard = document.createElement('div');
    bookCard.style = "background: white; padding: 10px; border-radius: 8px; width: 140px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); position: relative; margin-bottom: 20px;";
    
    bookCard.innerHTML = `
        <button onclick="deleteBook(${index})" style="position: absolute; top: -5px; left: -5px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; z-index: 10;">X</button>
        <img src="${book.cover}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 4px;">
        <h3 style="font-size: 14px; margin: 10px 0; height: 35px; overflow: hidden;">${book.title}</h3>
        <p style="font-size: 10px; color: #888;">${book.category || 'شرعي'}</p>
        <button onclick="window.open('${book.link}', '_blank')" style="background: #8d6e63; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">تحميل</button>
    `;
    grid.appendChild(bookCard);
}

function deleteBook(index) {
    if (confirm("أكيد بدك تحذف هالكتاب؟ 🧐")) {
        const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];
        savedBooks.splice(index, 1);
        localStorage.setItem('myBooks', JSON.stringify(savedBooks));
        loadBooks();
    }
}

function playAudio(title, url) {
    const player = document.getElementById('main-player');
    const titleDisplay = document.getElementById('audio-title');
    player.src = url;
    titleDisplay.innerText = "أنت تستمع الآن إلى: " + title;
    player.play();
}
