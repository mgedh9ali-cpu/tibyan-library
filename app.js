// دالة لإضافة كتاب جديد
function addNewBook() {
    let title = prompt("شو اسم الكتاب اللي بدك تضيفه؟");
    let link = prompt("حط رابط الـ PDF هون:");
    
    if (title && link) {
        const grid = document.getElementById('booksGrid');
        
        // إنشاء كرت الكتاب الجديد
        const bookCard = document.createElement('div');
        bookCard.style = "background: white; padding: 10px; border-radius: 8px; width: 140px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);";
        
        bookCard.innerHTML = `
            <img src="https://placehold.co/100x150/5d4037/white?text=${title}" style="width: 100%; border-radius: 4px;">
            <h3 style="font-size: 14px; margin: 10px 0;">${title}</h3>
            <button onclick="window.open('${link}', '_blank')" style="background: #8d6e63; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">تحميل</button>
        `;
        
        grid.appendChild(bookCard);
        alert("تمت إضافة الكتاب بنجاح لمكتبتك! 🎉");
    } else {
        alert("يا حيزوم لازم تعبي البيانات صح! 🧐");
    }
}
