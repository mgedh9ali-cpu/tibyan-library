// 1. مكتبة أصوات الطبيعة الذكية
const natureLibrary = {
    "مطر": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // مثال لصوت مطر
    "بحر": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", // مثال لصوت موج
    "غابة": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", // مثال لعصافير
    "ليل": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", // مثال لصوت هدوء ليلي
    "رعب": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"  // موسيقى تشويقية
};

let naturePlayer = new Audio();
naturePlayer.loop = true;

// 2. المحلل الذكي للنص (AI-Light Analysis)
function analyzeTextAndPlaySound(text) {
    let foundSound = false;
    
    // البحث في النص عن كلمات مفتاحية
    for (let key in natureLibrary) {
        if (text.includes(key)) {
            naturePlayer.src = natureLibrary[key];
            naturePlayer.play();
            foundSound = true;
            console.log("الذكاء الهادئ: تم تفعيل صوت " + key);
            break;
        }
    }
    
    if (!foundSound) {
        naturePlayer.pause(); // إذا النص عادي، خلي الجو هادي (قراءة صامتة ذكية)
    }
}

// 3. دالة تشغيل الكتاب مع التحليل (الميزة الأساسية)
function startSmartReading(title, contentSummary) {
    const status = document.getElementById('audio-status');
    status.innerText = "تحليل الأجواء لـ: " + title;
    
    // تشغيل الصوت الأساسي للكتاب
    playAudio(title, "رابط_صوت_الكتاب");
    
    // تحليل النص لتشغيل خلفية طبيعية تناسبه
    analyzeTextAndPlaySound(contentSummary);
}

// 4. دمج الميزات السابقة (البحث، الإضافة، الحفظ)
function loadBooks(filter = "") {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';
    const savedBooks = JSON.parse(localStorage.getItem('myBooks')) || [];

    savedBooks.forEach((book, index) => {
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
            const card = document.createElement('div');
            card.style = "min-width:140px; background:white; padding:10px; border-radius:10px; text-align:center; position:relative;";
            card.innerHTML = `
                <button onclick="deleteBook(${index})" style="position:absolute; top:5px; left:5px; border:none; background:red; color:white; border-radius:50%; cursor:pointer;">X</button>
                <img src="${book.cover}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
                <h4 style="margin:5px 0; font-size:12px;">${book.title}</h4>
                <button onclick="startSmartReading('${book.title}', '${book
