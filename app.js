document.querySelector('button').addEventListener('click', function() {
    let bookName = document.querySelector('input').value;
    if (bookName) {
        alert("بحثنا في رفوف المكتبة عن '" + bookName + "' ولم نعثر عليه بعد. يمكنك طلبه عبر البوت: @TibyanBooks_bot");
    } else {
        alert("يرجى كتابة اسم الكتاب أولاً يا حيزوم! 😉");
    }
});
