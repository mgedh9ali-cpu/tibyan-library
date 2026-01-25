// 1. دالة لتحميل الكتب المحفوظة عند فتح الصفحة
window.onload = function() {
    const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];
    const grid = document.getElementById('booksGrid');
    
    savedBooks.forEach(book => {
        displayBook(book.title, book.link);
    });
};

// 2. دالة لإضافة كتاب جديد وحفظه
function addNewBook() {
    let title = prompt("شو اسم الكتاب اللي بدك تضيفه؟");
    let link = prompt("حط رابط الـ PDF هون:");
    
    if (title && link) {
        const book = { title, link };
        
        // حفظ في الذاكرة المحلية
        const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];
        savedBooks.push(book);
        localStorage.setItem('myBooks', JSON.stringify(savedBooks));
        
        // عرض الكتاب فوراً
        displayBook(title, link);
        alert("تم الحفظ في ذاكرة المكتبة! 🎉");
    } else {
        alert("يا حيزوم لازم تعبي البيانات! 🧐");
    }
}

// 3. دالة لعرض الكتاب في الصفحة
function displayBook(title, link) {
    const grid = document.getElementById('booksGrid');
    const bookCard = document.createElement('div');
    bookCard.style = "background: white; padding: 10px; border-radius: 8px; width: 140px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 15px;";
    
    bookCard.innerHTML = `
        <img src="https://placehold.co/100x150/5d4037/white?text=${title}" style="width: 100%; border-radius: 4px;">
        <h3 style="font-size: 14px; margin: 10px 0;">${title}</h3>
        <button onclick="window.open('${link}', '_blank')" style="background: #8d6e63; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">تحميل</button>
    `;
    grid.appendChild(bookCard);
}
