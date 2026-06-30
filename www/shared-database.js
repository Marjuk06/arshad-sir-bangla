// Shared Database - FIXED URL
const sharedDB = {
    lastUpdated: "2026-01-11T09:30:00.000Z",
    pdfs: [
        // গদ্য (Prose)
        { id: 1, category: 'godyo', title: 'বাঙ্গালার নব্য লেখকদিগের প্রতি নিবেদন', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(1)Nobbo lakok(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 2, category: 'godyo', title: 'অপরিচিতা', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(2)Oporichita(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 3, category: 'godyo', title: 'সাহিত্যের খেলা', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(3)সাহিত্যের খেলা (new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 4, category: 'godyo', title: 'বিলাসী', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(4)Bilashi(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 5, category: 'godyo', title: 'অর্ধাঙ্গী', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(5)ardangi(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 6, category: 'godyo', title: 'যৌবনের গান', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(7)Jouboner gan(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 7, category: 'godyo', title: 'জীবন ও বৃক্ষ', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(8)Jibon o brikkho(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 8, category: 'godyo', title: 'গন্তব্য কাবুল', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(10)Gontobbo Kabul(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 9, category: 'godyo', title: 'মাসি পিসি', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(11)Masi-Pisi(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 10, category: 'godyo', title: 'কপিলদাস মুর্মুর শেষ কাজ', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(12)kopildas murmu shes kaj(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 11, category: 'godyo', title: 'রেনকোট', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(13)Raincoat(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 12, category: 'godyo', title: 'নেকলেস', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(14)Necless(new).pdf', uploadDate: '2025-01-15', readCount: 0 },

        // নাটক (Drama)
        { id: 24, category: 'natok', title: 'নাটক (Full)', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/Natok (full) .pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 25, category: 'natok', title: 'টিকা ও চরিত্র-পরিচিতি', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/টিকা ও চরিত্র-পরিচিতি.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 26, category: 'natok', title: 'প্রথম অঙ্ক - প্রথম দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/প্রথম অঙ্ক - প্রথম দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 27, category: 'natok', title: 'প্রথম অঙ্ক - দ্বিতীয় দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/প্রথম অঙ্ক - দ্বিতীয় দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 28, category: 'natok', title: 'প্রথম অঙ্ক - তৃতীয় দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/প্রথম অঙ্ক - তৃতীয় দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 29, category: 'natok', title: 'দ্বিতীয় অঙ্ক - প্রথম দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/দ্বিতীয় অঙ্ক - প্রথম দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 30, category: 'natok', title: 'দ্বিতীয় অঙ্ক - দ্বিতীয় দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/দ্বিতীয় অঙ্ক -দ্বিতীয়  দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 31, category: 'natok', title: 'দ্বিতীয় অঙ্ক - তৃতীয় দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/দ্বিতীয় অঙ্ক - তৃতীয় দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 32, category: 'natok', title: 'তৃতীয় অঙ্ক - প্রথম দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/তৃতীয়  অঙ্ক -প্রথম দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 33, category: 'natok', title: 'তৃতীয় অঙ্ক - দ্বিতীয় দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/তৃতীয়  অঙ্ক -দ্বিতীয় দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 34, category: 'natok', title: 'তৃতীয় অঙ্ক - তৃতীয় দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/তৃতীয়  অঙ্ক - তৃতীয়  দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 35, category: 'natok', title: 'তৃতীয় অঙ্ক - চতুর্থ দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/তৃতীয়  অঙ্ক -চতুর্থ দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 36, category: 'natok', title: 'চতুর্থ অঙ্ক - প্রথম দৃশ্য', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/চতুর্থ অঙ্ক -প্রথম দৃশ্য.pdf', uploadDate: '2025-01-15', readCount: 0 },

        // উপন্যাস (Novel)
        { id: 57, category: 'uponnas', title: 'লালসালু (Full)', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/লালসালু (Full).pdf', uploadDate: '2025-01-15', readCount: 0 },

        { id: 37, category: 'uponnas', title: 'লালসালু - প্রথম অংশ', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/লালসালু part 1.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 38, category: 'uponnas', title: 'লালসালু - দ্বিতীয় অংশ', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/লালসালু part 2.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 39, category: 'uponnas', title: 'লালসালু - তৃতীয় অংশ', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/লালসালু part 3.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 40, category: 'uponnas', title: 'লালসালু - চতুর্থ অংশ', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/লালসালু part 4.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 41, category: 'uponnas', title: 'লালসালু - পঞ্চম অংশ', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/লালসালু part 5.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 42, category: 'uponnas', title: 'লালসালু - ষষ্ঠ অংশ', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/লালসালু part 6.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 43, category: 'uponnas', title: 'লালসালু - সপ্তম অংশ', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/লালসালু part 7.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 44, category: 'uponnas', title: 'লালসালু - অষ্টম অংশ', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/লালসালু part 8.pdf', uploadDate: '2025-01-15', readCount: 0 },

        // পদ্য (Poetry)
        { id: 45, category: 'podyo', title: 'ঋতুবর্ণাণ', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(1)ঋতু বর্ণন(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 46, category: 'podyo', title: 'বিভীষণের প্রতি মেঘনাদ', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(2)Bibisoner proti(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 47, category: 'podyo', title: 'সোনার তরী', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(3)সোনার তরী (new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 48, category: 'podyo', title: 'বিদ্রোহী', isImportant: true, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(4)biddrohi(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 49, category: 'podyo', title: 'সুচেতনা', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(5)সুচেতনা (new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 50, category: 'podyo', title: 'প্রতিদান', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(12)protidan(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 51, category: 'podyo', title: 'তাহারেই পড়ে মনে', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(6)Tahare pore mone.pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 52, category: 'podyo', title: 'পদ্মা', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(7)Padma(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 53, category: 'podyo', title: '১৮ বছর বয়স', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(8)১৮ বছর বয়স (new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 54, category: 'podyo', title: 'ফেব্রুয়ারি ১৯৬৯', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(9)February 1969(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 55, category: 'podyo', title: 'আমি কিংবদন্তির কথা বলছি', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(10) Ami king bodontir kotha bolchi (new).pdf', uploadDate: '2025-01-15', readCount: 0 },
        { id: 56, category: 'podyo', title: 'প্রত্যাবর্তনের লজ্জা', isImportant: false, fileUrl: 'https://pub-99582c49f1ab43a6bc2ccd0123d080d0.r2.dev/(11)portaborton Ere Lozza(new).pdf', uploadDate: '2025-01-15', readCount: 0 },
    ],
    categories: {
        godyo: { name: 'গদ্য', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>` },
        podyo: { name: 'পদ্য', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>` },
        natok: { name: 'নাটক', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` },
        uponnas: { name: 'উপন্যাস', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>` }
    },
    notice: "সকল ছাত্র-ছাত্রীদের জানানো যাচ্ছে যে, অফলাইন সুবিধার জন্য প্রয়োজনীয় পিডিএফগুলো 'Save for Offline' বাটনে ক্লিক করে সংরক্ষণ করা যাবে। আগামী পরীক্ষার জন্য 'সিরাজউদ্দৌলা' এবং 'লালসালু' সবচেয়ে গুরুত্বপূর্ণ।"
};

function saveToLocalStorage() { localStorage.setItem('banglaBatchDB', JSON.stringify(sharedDB)); }
function loadFromLocalStorage() { 
    const saved = localStorage.getItem('banglaBatchDB');
    if (saved) {
        // Force refresh if old cache exists
        try {
             const parsed = JSON.parse(saved);
             // Verify if the cache uses the NEW Cloudflare URL, if not, kill it
             if (parsed.pdfs && parsed.pdfs[0].fileUrl.includes('99582c49f1ab43a6bc2ccd0123d080d0')) {
                 sharedDB.pdfs = parsed.pdfs || sharedDB.pdfs;
                 sharedDB.categories = parsed.categories || sharedDB.categories;
             } else {
                 localStorage.removeItem('banglaBatchDB');
             }
        } catch(e) { localStorage.removeItem('banglaBatchDB'); }
    }
}
function incrementReadCount(pdfId) {
    const pdf = sharedDB.pdfs.find(p => p.id === pdfId);
    if (pdf) { pdf.readCount = (pdf.readCount || 0) + 1; saveToLocalStorage(); }
}
function clearOldCache() { 
    // Clear old cache to force the new URLs to load
    if(localStorage.getItem('banglaBatchDB')) {
        const saved = localStorage.getItem('banglaBatchDB');
        if(!saved.includes('99582c49f1ab43a6bc2ccd0123d080d0')) {
             localStorage.removeItem('banglaBatchDB');
        }
    }
}
clearOldCache();