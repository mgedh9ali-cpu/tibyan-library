// بيانات الكتب (عدّل الأسماء والمسارات براحتك)
const books = [
  {
    id: 1,
    title: "الزاد",
    author: "مؤلف الزاد",
    cover: "https://via.placeholder.com/200x300?text=%D8%A7%D9%84%D8%B2%D8%A7%D8%AF",
    sample: "books/zad-sample.pdf",
    file: "books/zad-full.pdf",
    done: false
  },
  {
    id: 2,
    title: "كتاب تجريبي",
    author: "مؤلف تجريبي",
    cover: "https://via.placeholder.com/200x300?text=Sample",
    sample: "books/sample.pdf",
    file: "books/full.pdf",
    done: false
  }
];

const library = document.getElementById("library");
const mybooks = document.getElementById("mybooks");
const reader = document.getElementById("reader");
const readerTitle = document.getElementById("readerTitle");
const readerFrame = document.getElementById("readerFrame");

let currentBook = null;
let audio = new Audio();
audio.loop = true;
audio.volume = 0.3;

const sounds = {
  warraq: "sounds/warraq.mp3",
  night: "sounds/nightreader.mp3",
  researcher: "sounds/researcher.mp3",
  friend: "sounds/friend.mp3"
};

// تحميل الكتب في المكتبة
books.forEach((b) => {
  const d = document.createElement("div");
  d.className = "book";
  d.innerHTML = `
    <img src="${b.cover}" alt="${b.title}" />
    <h4>${b.title}</h4>
    <small>${b.author}</small>
  `;
  d.onclick = () => openBook(b);
  library.appendChild(d);
});

// تعبئة الملف الشخصي
document.getElementById("bookCount").innerText = books.length;
document.getElementById("doneCount").innerText = books.filter((b) => b.done).length;

// تبويبات
function showTab(id) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  const btn = Array.from(document.querySelectorAll(".tab-btn")).find((b) =>
    b.getAttribute("onclick").includes(id)
  );
  if (btn) btn.classList.add("active");

  if (id === "mybooks") renderMyBooks();
}

function renderMyBooks() {
  mybooks.innerHTML = "";
  books
    .filter((b) => b.done)
    .forEach((b) => {
      const d = document.createElement("div");
      d.className = "book";
      d.innerHTML = `
        <img src="${b.cover}" alt="${b.title}" />
        <h4>${b.title}</h4>
        <small>${b.author}</small>
      `;
      d.onclick = () => openBook(b);
      mybooks.appendChild(d);
    });
}

// فتح القارئ
function openBook(b) {
  currentBook = b;
  readerTitle.innerText = b.title;
  readerFrame.src = b.sample || b.file;
  reader.classList.remove("hidden");
}

// إغلاق القارئ
function closeReader() {
  reader.classList.add("hidden");
  readerFrame.src = "";
  audio.pause();
}

// PDF sample / full
function openSample() {
  if (!currentBook) return;
  if (!currentBook.sample) {
    alert("لا توجد نسخة تجريبية لهذا الكتاب.");
    return;
  }
  readerFrame.src = currentBook.sample;
}

function openFull() {
  if (!currentBook) return;
  readerFrame.src = currentBook.file;
  currentBook.done = true;
  document.getElementById("doneCount").innerText = books.filter((b) => b.done).length;
}

// الصوت الخلفي
function selectSound(type) {
  if (!sounds[type]) return;
  audio.src = sounds[type];
  if (document.getElementById("enableSound").checked) {
    audio.play();
  }
}

function toggleSound() {
  const enabled = document.getElementById("enableSound").checked;
  if (!enabled) {
    audio.pause();
    return;
  }
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

// مستوى الصوت من الإعدادات
document.getElementById("volumeRange").addEventListener("input", (e) => {
  audio.volume = parseFloat(e.target.value);
});

// تلخيص نصي (مؤقت Alert)
function textSummary() {
  if (!currentBook) return;
  alert("هنا سيكون التلخيص النصي للكتاب (تكتب التلخيص يدوي أو تولده لاحقاً).");
}

// تلخيص صوتي باستخدام SpeechSynthesis
function audioSummary() {
  const enabled = document.getElementById("enableAudioSummary").checked;
  if (!enabled) return;

  if (!currentBook) return;
  const text = `هذا تلخيص صوتي تجريبي لكتاب ${currentBook.title}. 
  يمكنك استبدال هذا النص بتلخيص حقيقي لاحقاً.`;

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar";
  speechSynthesis.speak(u);
}

// الثيم
function setTheme(t) {
  document.body.className = ""; // تنظيف
  if (t === "royal") document.body.classList.add("royal-bg");
  if (t === "light") document.body.classList.add("light");
  if (t === "dark") document.body.classList.add("dark");
}
