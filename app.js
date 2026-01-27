const books = [
  {
    id:1,
    title:"كتاب تجريبي",
    author:"قارئ",
    cover:"https://via.placeholder.com/200x300",
    sample:"books/sample.pdf",
    file:"books/full.pdf",
    done:false
  }
];

const library = document.getElementById('library');
const mybooks = document.getElementById('mybooks');

books.forEach(b=>{
  const d=document.createElement('div');
  d.className='book';
  d.innerHTML=`<img src="${b.cover}"><h4>${b.title}</h4>`;
  d.onclick=()=>openBook(b);
  library.appendChild(d);
});

function showTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

let currentBook=null;

function openBook(b){
  currentBook=b;
  document.getElementById('readerTitle').innerText=b.title;
  document.getElementById('readerFrame').src=b.sample;
  document.getElementById('reader').classList.remove('hidden');
}

function closeReader(){
  document.getElementById('reader').classList.add('hidden');
}

function openSample(){ readerFrame.src=currentBook.sample }
function openFull(){ readerFrame.src=currentBook.file }

let audio=new Audio('sounds/warraq.mp3');
audio.loop=true;

function toggleSound(){
  document.getElementById('enableSound').checked
  ? audio.paused?audio.play():audio.pause()
  : audio.pause();
}

function textSummary(){
  alert("ملخص ورقي مختصر للكتاب.");
}

function audioSummary(){
  if(!document.getElementById('enableAudioSummary').checked) return;
  let u=new SpeechSynthesisUtterance("هذا ملخص صوتي.");
  u.lang='ar';
  speechSynthesis.speak(u);
}

function setTheme(t){
  document.body.className = t==='royal'?'royal-bg':t;
}
