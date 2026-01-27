/* بيانات الكتب */
const books = [
  {
    id: 1,
    title: "كتاب تجريبي",
    author: "قارئ مجهول",
    cover: "https://via.placeholder.com/200x300?text=كتاب",
    sample: "books/sample.pdf",
    file: "books/full.pdf"
  }
];

/* عناصر الصفحة */
const library = document.getElementById('library');
const reader = document.getElementById('reader');
const frame = document.getElementById('bookFrame');
const titleEl = document.getElementById('bookTitle');
const authorEl = document.getElementById('bookAuthor');

/* عرض المكتبة */
books.forEach(book => {
  const div = document.createElement('div');
  div.className = 'book';
  div.innerHTML = `
    <img src="${book.cover}">
    <h3>${book.title}</h3>
    <small>${book.author}</small>
  `;
  div.onclick = () => openBook(book);
  library.appendChild(div);
});

/* فتح كتاب */
let currentBook = null;
let mode = 'sample';

function openBook(book) {
  currentBook = book;
  titleEl.innerText = book.title;
  authorEl.innerText = book.author;
  frame.src = book.sample;
  mode = 'sample';
  reader.classList.remove('hidden');
}

/* إغلاق القارئ */
function closeReader() {
  reader.classList.add('hidden');
  audio.pause();
}

/* العَيّنة والكامل */
function openSample() {
  frame.src = currentBook.sample;
  mode = 'sample';
}

function openFull() {
  frame.src = currentBook.file;
  mode = 'full';
}

/* الأصوات */
let audio = new Audio();
audio.loop = true;
audio.volume = 0.3;

const sounds = {
  warraq: 'sounds/warraq.mp3',
  night: 'sounds/night_reader.mp3',
  researcher: 'sounds/researcher.mp3',
  friend: 'sounds/friend.mp3'
};

function selectSound(type) {
  audio.src = sounds[type];
  audio.play();
}

function toggleSound() {
  audio.paused ? audio.play() : audio.pause();
}

function setVolume(v) {
  audio.volume = v;
}

/* التلخيص */
function textSummary() {
  alert("تلخيص ورقي:\nيعرض هذا الكتاب الأفكار الأساسية بأسلوب منظم وميسر.");
}

function audioSummary() {
  const msg = new SpeechSynthesisUtterance(
    "هذا ملخص صوتي مختصر يقدّم أهم أفكار الكتاب للقارئ."
  );
  msg.lang = 'ar';
  speechSynthesis.speak(msg);
}
