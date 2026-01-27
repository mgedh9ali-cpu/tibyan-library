<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تبيان - النسخة الملكية الكاملة</title>
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div id="splash">
    <video id="introVideo" playsinline muted autoplay loop><source src="intro.mp4" type="video/mp4"></video>
    <div class="splash-overlay">
        <h1 class="royal-font logo-anim">تبيان</h1>
        <div class="loading-bar"></div>
    </div>
</div>

<header class="main-header">
    <h1 class="royal-font">تبيان</h1>
    <div id="dailyQuoteDisplay" class="daily-quote-box">"بوابة العلم والتحصيل"</div>
</header>

<main id="appContent">
    
    <section id="home" class="page-section active-section">
        <div class="search-area">
            <div class="search-wrapper">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="searchField" class="search-bar" placeholder="ابحث عن كتاب، مؤلف..." onkeyup="liveSearch()">
            </div>
        </div>
        <div class="royal-label">✨ المضافة حديثاً</div>
        <div class="book-grid-horizontal" id="recentGrid"></div>
        <div class="royal-label">🏛️ المكتبة العامة</div>
        <div id="mainGrid" class="book-grid"></div>
    </section>

    <section id="mylist" class="page-section">
        <div class="glass-card ward-box">
            <h4>📅 وردي اليومي</h4>
            <div class="progress-bar"><div id="wardFill" class="fill"></div></div>
            <div class="ward-controls">
                <input type="number" id="pageInput" placeholder="الصفحات">
                <button class="gold-btn" onclick="updateWard()">تحديث</button>
            </div>
        </div>
        <div class="tabs-royal">
            <button class="tab-btn active" onclick="filterMyList('reading', this)">📖 قيد القراءة</button>
            <button class="tab-btn" onclick="filterMyList('completed', this)">✅ مكتملة</button>
        </div>
        <div id="listGrid" class="book-grid"></div>
        <div class="glass-card">
            <h4 class="royal-font"><i class="fas fa-pen-nib"></i> مؤلفيني المفضلين</h4>
            <div id="authorsList" class="authors-flex"></div>
        </div>
    </section>

    <section id="me" class="page-section">
        <div class="glass-card profile-card">
            <div class="avatar-ring"><i class="fas fa-user-shield"></i></div>
            <h2>حيزوم</h2>
            <p class="user-bio">محب للكتب التراثية | طالب ثنوي شرعي علمي</p>
            <div class="stats-grid">
                <div class="stat-item"><b id="statTotal">0</b><br><small>كتب</small></div>
                <div class="stat-item"><b id="statDone">0</b><br><small>منتهية</small></div>
            </div>
            <div class="notes-section">
                <h4>📝 ملاحظاتي</h4>
                <textarea id="userNotes" placeholder="اكتب اقتباساتك هنا..."></textarea>
                <button class="gold-btn-sm" onclick="saveNotes()">حفظ 💾</button>
            </div>
        </div>
    </section>

    <section id="settings" class="page-section">
        <div class="glass-card">
            <div class="set-row"><span>🌙 الوضع الليلي</span><i class="fas fa-toggle-on"></i></div>
            <div class="set-row"><span>🎨 تغيير الألوان</span><i class="fas fa-palette"></i></div>
            <div class="set-row"><span>🔔 الإشعارات</span><input type="checkbox" checked></div>
            <div class="dev-box">
                <p>تم البرمجة بواسطة:</p>
                <b>أحمد محمد محمد علي (حيزوم)</b>
            </div>
        </div>
    </section>

    <section id="owner" class="page-section">
        <div class="glass-card owner-panel">
            <h3 class="royal-font">🛡️ لوحة التحكم</h3>
            <div class="input-group">
                <input type="text" id="newQuote" class="search-bar" placeholder="تغيير حكمة اليوم...">
                <button class="gold-btn-full" onclick="updateDailyQuote()">تحديث الحكمة</button>
            </div>
            <hr>
            <h4 class="royal-font">إضافة كتاب جديد</h4>
            <input type="text" id="ownerT" class="search-bar" placeholder="العنوان">
            <input type="text" id="ownerA" class="search-bar" placeholder="المؤلف">
            <input type="text" id="ownerSample" class="search-bar" placeholder="رابط العينة (PDF)">
            <input type="text" id="ownerFull" class="search-bar" placeholder="رابط الكتاب الكامل (PDF)">
            <button class="gold-btn-full" onclick="publishBook()">نشر 🚀</button>
        </div>
    </section>

</main>

<section id="readerView" class="reader-layer hidden">
    <div class="reader-header">
        <button class="back-btn" onclick="closeReader()"><i class="fas fa-arrow-right"></i> خروج</button>
        <h3 id="readerTitle" class="royal-font">عنوان الكتاب</h3>
    </div>
    
    <iframe id="bookFrame" src=""></iframe>

    <div class="reader-controls glass-card">
        <div class="top-controls">
            <button onclick="openSample()">📄 العينة</button>
            <button onclick="openFull()">📖 الكامل</button>
            <button onclick="addToMyListFromReader()">➕ لقائمتي</button>
            <button onclick="textSummary()">📝 تلخيص</button>
            <button onclick="audioSummary()">🔊 ملخص صوتي</button>
        </div>
        
        <hr style="border-color: rgba(212,175,55,0.3);">
        
        <div class="voice-controls">
            <span style="font-size:12px; font-weight:bold;">🎙️ رفيق القراءة:</span>
            <div class="voices-list">
                <button onclick="selectSound('warraq')">الورّاق</button>
                <button onclick="selectSound('night')">الليلي</button>
                <button onclick="selectSound('researcher')">الباحث</button>
                <button onclick="selectSound('friend')">الصديق</button>
            </div>
            <div class="playback">
                <button onclick="toggleSound()" id="playPauseBtn">⏯️ تشغيل</button>
                <input type="range" min="0" max="1" step="0.1" onchange="setVolume(this.value)">
            </div>
        </div>
    </div>
</section>

<nav class="nav-bar">
    <button class="nav-item active" onclick="nav('home', this)"><i class="fas fa-home"></i><span>الرئيسية</span></button>
    <button class="nav-item" onclick="nav('mylist', this)"><i class="fas fa-bookmark"></i><span>قائمتي</span></button>
    <button class="nav-item" onclick="nav('me', this)"><i class="fas fa-user"></i><span>أنا</span></button>
    <button class="nav-item" onclick="nav('settings', this)"><i class="fas fa-cog"></i><span>الإعدادات</span></button>
    <button id="ownerNavBtn" class="nav-item" style="display:none;" onclick="nav('owner', this)"><i class="fas fa-crown"></i><span>المالك</span></button>
</nav>

<script src="app.js"></script>
</body>
</html>
