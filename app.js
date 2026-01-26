// إخفاء شاشة الترحيب بعد 3 ثواني
window.onload = () => {
  setTimeout(()=>{
    document.getElementById("splash").style.display="none";
    document.getElementById("app").style.display="block";
  },3000);
};

// التنقل بين الصفحات
function nav(sectionId, btn){
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active-section'));
  document.getElementById(sectionId).classList.add('active-section');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// الوضع الليلي
function toggleDarkMode(){
  document.body.classList.toggle("dark-mode");
}

// ستايل الوضع الليلي
const style = document.createElement('style');
style.innerHTML = `
.dark-mode {
  background: #121212 !important;
  color: #eee !important;
}
.dark-mode .main-header {
  background: linear-gradient(135deg, #000, #333);
}
.dark-mode .nav-bar {
  background: rgba(0,0,0,0.9);
}
`;
document.head.appendChild(style);
