// --- CONFIGURATION ---
const db = sharedDB; 

const AppState = {
    readPdfs: JSON.parse(localStorage.getItem('readPdfs')) || [],
    savedPdfs: JSON.parse(localStorage.getItem('savedPdfs')) || [],
    theme: localStorage.getItem('theme') || 'light',
    haptics: localStorage.getItem('haptics') !== 'false'
};

let pdfDoc = null;
let currentZoom = 1.0; 
// Pinch Zoom Variables
let initialPinchDistance = 0;
let initialPinchZoom = 1.0;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        initTheme();
        renderHomepage();
        
        // Web Browser Back Button Logic
        window.onpopstate = function(event) {
            handleBackAction(event);
        };
        
        history.replaceState({page: 'home'}, '', '');
        
        // Capacitor Hardware Back Button
        setupCapacitorBackButton();
        
        PWA_SETUP.init();
    } catch (e) {
        alert("Startup Error: " + e.message + "\n\nPlease send a screenshot of this error.");
    }
});

// --- CAPACITOR BACK BUTTON LOGIC ---
async function setupCapacitorBackButton() {
    if (window.Capacitor) {
        const { App } = Capacitor.Plugins;
        App.addListener('backButton', ({ canGoBack }) => {
            const pdfModal = document.getElementById('pdf-reader-modal');
            
            // 1. If PDF is open, close it
            if (pdfModal) {
                pdfModal.remove();
                window.history.back(); 
                return;
            }

            // 2. If in a Category/Settings, go back to Home
            const currentState = history.state;
            if (currentState && currentState.page !== 'home') {
                window.history.back();
                return;
            }

            // 3. If at Home, Exit App
            App.exitApp();
        });
    }
}

function handleBackAction(event) {
    if (event && event.state) {
        if (event.state.page === 'home') renderHomepage();
        else if (event.state.page === 'category') renderPdfList(event.state.id);
        else if (event.state.page === 'settings') renderSettingsPage();
    } else {
        renderHomepage();
    }
    
    const pdfModal = document.getElementById('pdf-reader-modal');
    if (pdfModal) {
        pdfModal.remove();
    }
}

// --- UTILS ---
function triggerHaptic() {
    if (AppState.haptics) {
        if (window.Capacitor) {
            try { Capacitor.Plugins.Haptics.impact({ style: 'MEDIUM' }); } catch (e) { if (navigator.vibrate) navigator.vibrate(40); }
        } else {
            if (navigator.vibrate) navigator.vibrate(40); 
        }
    }
}

// --- VIEWS ---

function renderHomepage() {
    const mainContent = document.getElementById('main-content');
    const headerTitle = document.querySelector('.gradient-text');
    if(headerTitle) headerTitle.textContent = "বাংলা ব্যাচ";
    
    const headerHTML = `
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-2xl font-extrabold gradient-text">বাংলা ব্যাচ</h2>
                <p class="text-xs font-bold mt-1" style="opacity:0.7">আপনার ফোল্ডার সিলেক্ট করুন</p>
            </div>
            <button onclick="renderSettingsPage()" class="glass-card !p-3 !m-0 hover:bg-white/50 active:scale-95">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
        </div>
    `;

    const categoriesHTML = Object.keys(db.categories).map(key => {
        const cat = db.categories[key];
        return `
        <div onclick="goToCategory('${key}')" class="glass-card group animate-stagger-enter">
            <div class="icon-box bg-green">${cat.icon}</div>
            <div class="flex-1"><h3 class="text-lg font-bold group-hover:text-green-600 transition-colors">${cat.name}</h3><p class="text-xs font-semibold" style="opacity:0.6">Folder</p></div>
            <div style="opacity:0.5"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>
        </div>`;
    }).join('');

    const donationHTML = `
        <div class="mt-8 mb-4 glass-card flex flex-col items-center justify-center text-center !p-5 shadow-sm animate-stagger-enter" style="animation-delay: 0.1s">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Support This App ❤️</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">আপনি যদি মনে করেন এই অ্যাপটি আপনার জন্য সহায়ক হয়েছে, তবে আপনার স্বতঃস্ফূর্ত ডোনেশন দিয়ে আমাকে সাপোর্ট করতে পারেন। আপনার এই অবদান অ্যাপটির রক্ষণাবেক্ষণ ও মান উন্নয়নে বিশেষ ভূমিকা রাখবে।</p>
            <p class="text-xs font-bold text-gray-700 dark:text-gray-400 mb-3">bkash | nagod | rocket | upay</p>
            <a href="https://codenest.paymently.io/paymentlink/pay/yXQ1EJKpaPPeUpG8gyNqFKFhprFGmVjfydVpfiXA" target="_blank" class="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md active:scale-95 no-underline">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Donate Now
            </a>
        </div>
    `;

    const developerInfoHTML = `
        <div class="mb-20 glass-card flex flex-col items-center justify-center text-center !p-5 shadow-sm animate-stagger-enter" style="animation-delay: 0.2s">
            <img src="https://github.com/marjuk06.png" alt="Marjuk Amin" class="w-16 h-16 rounded-full shadow-md mb-3 border-2 border-green-500 object-cover">
            <p class="text-sm font-extrabold text-gray-700 dark:text-gray-300 mb-2">Developed by <span class="gradient-text text-base">Marjuk Amin</span></p>
            <a href="https://wa.me/8801943549559" target="_blank" class="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-full text-xs font-bold hover:bg-[#128C7E] transition-all transform hover:scale-105 shadow-md active:scale-95 no-underline">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 .002 5.385.002 12.033c0 2.126.554 4.195 1.606 6.012L.004 24l6.096-1.597c1.765 1.01 3.754 1.542 5.931 1.542 6.646 0 12.03-5.386 12.03-12.033C24 5.385 18.615 0 12.031 0zm.001 21.996c-1.802 0-3.567-.484-5.111-1.401l-.367-.217-3.799.996.996-3.798-.238-.378C2.545 15.544 2.016 13.823 2.016 12.033 2.016 6.51 6.508 2.017 12.031 2.017c5.525 0 10.016 4.492 10.016 10.016 0 5.524-4.491 10.016-10.016 10.016zm5.501-7.518c-.302-.151-1.787-.882-2.063-.984-.275-.101-.475-.151-.676.151-.202.302-.782.984-.959 1.185-.176.202-.353.227-.655.076-1.784-.897-3.23-2.193-4.11-4.041-.11-.23.11-.219.4-.805.097-.196.048-.368-.026-.519-.076-.151-.676-1.63-.927-2.233-.243-.585-.49-.505-.676-.514-.176-.01-.377-.01-.578-.01-.202 0-.528.075-.805.378-.276.302-1.055 1.031-1.055 2.516s1.08 2.917 1.23 3.118c.151.202 2.127 3.245 5.152 4.549.718.309 1.278.494 1.716.632.721.229 1.378.197 1.896.119.58-.088 1.787-.73 2.038-1.436.252-.705.252-1.309.176-1.436-.075-.126-.275-.202-.577-.353z"/></svg>
                Any Problem? Message on WhatsApp
            </a>
        </div>
    `;

    mainContent.innerHTML = `<div class="px-4 pt-2">${headerHTML}<div class="grid grid-cols-1 gap-2">${categoriesHTML}</div>${donationHTML}${developerInfoHTML}</div>`;
    
    // Show donation popup when homepage loads
    showDonationPopup();
}

function showDonationPopup() {
    // Only show once per day
    const lastShown = localStorage.getItem('donationPopupLastShown');
    const today = new Date().toDateString();
    
    if (lastShown === today) return; 
    localStorage.setItem('donationPopupLastShown', today);
    
    const popupHTML = `
        <div id="donation-popup" class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-stagger-enter" style="animation-duration: 0.3s">
            <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative flex flex-col items-center text-center">
                <button onclick="document.getElementById('donation-popup').remove()" class="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-colors">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                
                <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                    <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </div>
                
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Support This App ❤️</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">আপনি যদি মনে করেন এই অ্যাপটি আপনার জন্য সহায়ক হয়েছে, তবে আপনার স্বতঃস্ফূর্ত ডোনেশন দিয়ে আমাকে সাপোর্ট করতে পারেন। আপনার এই অবদান অ্যাপটির রক্ষণাবেক্ষণ ও মান উন্নয়নে বিশেষ ভূমিকা রাখবে।</p>
                <p class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-6">bkash | nagod | rocket | upay</p>
                
                <a href="https://codenest.paymently.io/paymentlink/pay/yXQ1EJKpaPPeUpG8gyNqFKFhprFGmVjfydVpfiXA" target="_blank" onclick="document.getElementById('donation-popup').remove()" class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg active:scale-95 no-underline">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Donate Now
                </a>
            </div>
        </div>
    `;
    
    // Add to body after a short delay so it feels natural
    setTimeout(() => {
        if(!document.getElementById('donation-popup')) {
            document.body.insertAdjacentHTML('beforeend', popupHTML);
        }
    }, 1000);
}

function renderPdfList(categoryKey) {
    const mainContent = document.getElementById('main-content');
    const category = db.categories[categoryKey];
    const pdfs = db.pdfs.filter(p => p.category === categoryKey);
    const headerTitle = document.querySelector('.gradient-text');
    if(headerTitle) headerTitle.textContent = category.name;

    mainContent.innerHTML = `
        <div class="px-4 pt-2 animate-stagger-enter">
            <div class="flex items-center gap-3 mb-6">
                <button onclick="goBack()" class="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-colors">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-700 dark:text-white"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <h2 class="text-2xl font-bold gradient-text">${category.name}</h2>
            </div>
            <div class="grid grid-cols-1 gap-2 pb-20">
                ${pdfs.length > 0 ? pdfs.map(pdf => createPdfItem(pdf)).join('') : `<div class="text-center py-10" style="opacity:0.6"><p>No PDFs found.</p></div>`}
            </div>
        </div>`;
}

function createPdfItem(pdf) {
    const isSaved = AppState.savedPdfs.includes(pdf.id);
    const iconColor = pdf.category === 'godyo' ? 'bg-orange' : (pdf.category === 'podyo' ? 'bg-purple' : 'bg-blue');
    return `
    <div id="pdf-card-${pdf.id}" onclick="handlePdfClick(${pdf.id}, '${pdf.fileUrl}')" class="glass-card group cursor-pointer">
        <div class="icon-box ${iconColor}"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
        <div class="flex-1 min-w-0"><h3 class="text-sm font-bold truncate pr-6">${pdf.title}</h3><div id="status-${pdf.id}" class="flex items-center gap-2 mt-1">${isSaved ? `<span class="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full flex items-center gap-1">Saved Offline</span>` : `<span class="text-[10px] font-bold" style="opacity:0.6">Tap to Read</span>`}</div></div>
        ${pdf.isImportant ? '<div class="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-t-red-500 border-l-[30px] border-l-transparent"><span class="absolute -top-[28px] -right-[2px] text-white text-[10px] font-bold">★</span></div>' : ''}
    </div>`;
}

function renderSettingsPage() {
    triggerHaptic();
    const mainContent = document.getElementById('main-content');
    history.pushState({page: 'settings'}, '', '#settings');
    const headerTitle = document.querySelector('.gradient-text');
    if(headerTitle) headerTitle.textContent = "Settings";

    mainContent.innerHTML = `
        <div class="px-4 pt-2 animate-stagger-enter">
            <div class="flex items-center gap-3 mb-6">
                <button onclick="goBack()" class="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-colors">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-700 dark:text-white"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <h2 class="text-2xl font-bold">Settings</h2>
            </div>
            <h3 class="text-xs font-bold uppercase tracking-wider mb-3 ml-1" style="opacity:0.6">Appearance</h3>
            <div class="glass-card justify-between cursor-default"><div class="flex items-center gap-3"><div class="icon-box bg-purple"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></div><h3 class="font-bold">Dark Mode</h3></div><input type="checkbox" class="toggle-switch" ${AppState.theme === 'dark' ? 'checked' : ''} onchange="toggleTheme(this)"></div>
            <div class="glass-card justify-between cursor-default mb-6"><div class="flex items-center gap-3"><div class="icon-box bg-blue"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg></div><h3 class="font-bold">Haptic Feedback</h3></div><input type="checkbox" class="toggle-switch" ${AppState.haptics ? 'checked' : ''} onchange="toggleHaptics(this)"></div>
            <h3 class="text-xs font-bold uppercase tracking-wider mb-3 ml-1" style="opacity:0.6">Data</h3>
            <div onclick="clearAppCache()" class="glass-card justify-between active:scale-95 mb-6"><div class="flex items-center gap-3"><div class="icon-box bg-orange"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></div><h3 class="font-bold">Clear Cache</h3></div><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.5"><path d="M9 18l6-6-6-6"/></svg></div>
            <a href="https://github.com/Marjuk06/marjuk06" target="_blank" class="glass-card flex-col items-center text-center !p-6 cursor-pointer active:scale-95 no-underline"><div class="w-20 h-20 rounded-full mb-3 shadow-md overflow-hidden border-2 border-white/50"><img src="https://thumbs2.imgbox.com/ff/ed/R7clPUbF_t.jpg" alt="Marjuk" class="w-full h-full object-cover"></div><h3 class="text-xl font-extrabold gradient-text">Marjuk Amin</h3><p class="text-xs font-bold mb-3" style="opacity:0.8">App Developer</p><div class="flex gap-2"><span class="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-bold">React</span><span class="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-md font-bold">Node</span></div><p class="text-[10px] mt-4" style="opacity:0.5">Version 3.5 (Premium)</p></a>
        </div>`;
}

// --- NAVIGATION ACTIONS ---
function goToCategory(key) {
    triggerHaptic();
    history.pushState({page: 'category', id: key}, '', `#${key}`);
    renderPdfList(key);
}

function goBack() {
    triggerHaptic();
    window.history.back();
}
// --- PDF LOGIC (SCROLLABLE & ZOOMABLE) ---
async function handlePdfClick(pdfId, fileUrl) {
    triggerHaptic();
    const statusDiv = document.getElementById(`status-${pdfId}`);
    const isSaved = AppState.savedPdfs.includes(pdfId);
    
    history.pushState({page: 'reader', id: pdfId}, '', '#reader');

    const updateStatus = (html) => { if(statusDiv) statusDiv.innerHTML = html; };

    if (isSaved) {
        initScrollableReader(fileUrl, db.pdfs.find(p => p.id === pdfId).title);
    } else {
        updateStatus(`<div class="flex items-center gap-2"><div class="loader w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div><span class="text-[10px] font-bold text-green-700">Downloading...</span></div>`);

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            try {
                const messageChannel = new MessageChannel();
                navigator.serviceWorker.controller.postMessage({ action: 'cache-pdf', url: fileUrl }, [messageChannel.port2]);
                await new Promise(r => setTimeout(r, 1000));
                
                if (!AppState.savedPdfs.includes(pdfId)) {
                    AppState.savedPdfs.push(pdfId);
                    localStorage.setItem('savedPdfs', JSON.stringify(AppState.savedPdfs));
                }
                
                initScrollableReader(fileUrl, db.pdfs.find(p => p.id === pdfId).title);
                updateStatus(`<span class="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Saved Offline</span>`);

            } catch (e) {
                initScrollableReader(fileUrl, db.pdfs.find(p => p.id === pdfId).title);
            }
        } else {
            initScrollableReader(fileUrl, db.pdfs.find(p => p.id === pdfId).title);
        }
    }
}

async function initScrollableReader(url, title) {
    enableZoom();
    currentZoom = 1.0; 

    const viewerHTML = `
        <div id="pdf-reader-modal" class="fixed inset-0 z-[100] bg-gray-100 dark:bg-gray-900 flex flex-col animate-stagger-enter">
            <div class="fixed-top-bar flex items-center justify-between p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm z-20 border-b border-gray-200 dark:border-gray-700">
                <button onclick="goBack()" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-700 dark:text-white"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <h3 class="text-sm font-bold truncate max-w-[200px]" style="color: inherit">${title}</h3>
                <div class="w-8"></div>
            </div>
            
            <div id="pdf-scroll-container" class="pdf-scroll-container">
                <div id="pdf-loader" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-10">
                    <div class="flex flex-col items-center gap-3">
                        <div class="loader w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        <p id="pdf-loading-text" class="text-xs text-gray-500 font-bold">Opening PDF...</p>
                    </div>
                </div>
            </div>

            <div class="zoom-controls">
                <div onclick="manualZoomIn()" class="zoom-btn">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <div onclick="manualZoomOut()" class="zoom-btn">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', viewerHTML);

    // Initialize Optimized Pinch Logic
    setupPinchZoom();

    try {
        const loadingTask = pdfjsLib.getDocument(url);
        
        loadingTask.onProgress = function (progress) {
            if (progress.total > 0) {
                const percent = Math.round((progress.loaded / progress.total) * 100);
                const loadingText = document.getElementById('pdf-loading-text');
                if (loadingText) {
                    loadingText.textContent = `Downloading... ${percent}%`;
                }
            }
        };

        const pdf = await loadingTask.promise;
        const container = document.getElementById('pdf-scroll-container');
        const loader = document.getElementById('pdf-loader');
        
        // 1. Fetch Page 1 to determine aspect ratio for placeholders
        const firstPage = await pdf.getPage(1);
        const scale = 1.5; // Reduced from 2.0 to 1.5 for lightweight memory usage
        const viewport = firstPage.getViewport({ scale: scale });
        const aspectRatio = viewport.width / viewport.height;
        
        // Hide loader immediately so user can start scrolling
        loader.classList.add('hidden');

        // 2. Create placeholders for all pages
        const pagePlaceholders = [];
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'pdf-page-placeholder w-full mb-2 bg-gray-200 dark:bg-gray-800 flex items-center justify-center';
            placeholder.style.aspectRatio = aspectRatio.toString();
            placeholder.dataset.pageNum = pageNum;
            placeholder.dataset.rendered = "false";
            
            // Add a small loading spinner in the center of each placeholder
            placeholder.innerHTML = `<div class="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin opacity-50"></div>`;
            
            container.appendChild(placeholder);
            pagePlaceholders.push(placeholder);
        }

        // 3. Setup IntersectionObserver for Lazy Loading
        const observerOptions = {
            root: container,
            rootMargin: '150% 0px 150% 0px', // Load 1.5 viewports above and below
            threshold: 0
        };

        const renderPage = async (placeholder) => {
            const pageNum = parseInt(placeholder.dataset.pageNum);
            if (placeholder.dataset.rendered === "true" || placeholder.dataset.rendered === "rendering") return;
            
            // Mark as rendering to prevent duplicate fetches
            placeholder.dataset.rendered = "rendering";

            try {
                const page = await pdf.getPage(pageNum);
                const pageViewport = page.getViewport({ scale: scale });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = pageViewport.height;
                canvas.width = pageViewport.width;
                
                // Render the page
                await page.render({
                    canvasContext: context,
                    viewport: pageViewport
                }).promise;
                
                // Convert to JPEG image to save GPU canvas memory (CRITICAL for iOS/Tablets)
                const img = document.createElement('img');
                img.src = canvas.toDataURL('image/jpeg', 0.85);
                img.style.width = '100%';
                img.style.height = 'auto';
                img.className = 'pdf-page-canvas shadow-md';
                img.loading = "lazy";
                
                // Clear placeholder and adapt to image size
                placeholder.innerHTML = '';
                placeholder.style.aspectRatio = 'auto';
                placeholder.classList.remove('bg-gray-200', 'dark:bg-gray-800', 'flex', 'items-center', 'justify-center');
                
                placeholder.appendChild(img);
                
                placeholder.dataset.rendered = "true";
            } catch (err) {
                console.error("Failed to render page " + pageNum, err);
                placeholder.dataset.rendered = "false"; // allow retry if failed
                placeholder.innerHTML = `<span class="text-xs text-red-500">Failed to load page</span>`;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    renderPage(entry.target);
                }
            });
        }, observerOptions);

        // Observe all placeholders
        pagePlaceholders.forEach(p => observer.observe(p));

    } catch (error) {
        console.error(error);
        alert('Error rendering PDF.');
        goBack();
    }
}

// --- OPTIMIZED PINCH ZOOM LOGIC ---
function setupPinchZoom() {
    const container = document.getElementById('pdf-scroll-container');
    let startDistance = 0;
    let startZoom = 1.0;
    let isPinching = false;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            isPinching = true;
            startDistance = getDistance(e.touches);
            startZoom = currentZoom;
        }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        if (isPinching && e.touches.length === 2) {
            e.preventDefault(); 
            
            const newDistance = getDistance(e.touches);
            const scaleChange = newDistance / startDistance;
            
            let newZoom = startZoom * scaleChange;
            
            // FIX 3: Strict Limits
            if (newZoom < 1.0) newZoom = 1.0; // Stop zooming out beyond 100%
            if (newZoom > 4.0) newZoom = 4.0; // Max 400% zoom
            
            currentZoom = newZoom;
            
            requestAnimationFrame(() => {
                applyZoom();
            });
        }
    }, { passive: false });

    container.addEventListener('touchend', () => {
        isPinching = false;
        // Optional: Snap back to 100% if they somehow forced it lower
        if (currentZoom < 1.0) {
            currentZoom = 1.0;
            applyZoom();
        }
    });
}

function getDistance(touches) {
    return Math.hypot(
        touches[0].pageX - touches[1].pageX,
        touches[0].pageY - touches[1].pageY
    );
}

// --- MANUAL ZOOM BUTTONS ---
function manualZoomIn() {
    triggerHaptic();
    if (currentZoom < 4.0) {
        currentZoom += 0.25;
        applyZoom();
    }
}

function manualZoomOut() {
    triggerHaptic();
    // Stop at 1.0
    if (currentZoom > 1.0) {
        currentZoom -= 0.25;
        // Fix rounding errors
        if (currentZoom < 1.0) currentZoom = 1.0;
        applyZoom();
    }
}

function applyZoom() {
    const pages = document.querySelectorAll('.pdf-page-canvas');
    pages.forEach(page => {
        // Just setting width allows CSS overflow:auto to handle the scrolling
        page.style.width = `${currentZoom * 100}%`;
    });
}

// --- VIEWPORT HACK ---
function enableZoom() {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) meta.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes";
}

function resetViewport() {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
}
// --- UTILS ---
function toggleTheme(checkbox) {
    triggerHaptic();
    const isDark = checkbox.checked;
    AppState.theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', AppState.theme);
    initTheme();
}

function initTheme() {
    const body = document.body;
    if (AppState.theme === 'dark') body.classList.add('dark-mode');
    else body.classList.remove('dark-mode');
}

function toggleHaptics(checkbox) {
    triggerHaptic();
    AppState.haptics = checkbox.checked;
    localStorage.setItem('haptics', checkbox.checked);
}

function clearAppCache() {
    triggerHaptic();
    if (confirm("Delete all saved PDFs?")) {
        localStorage.clear();
        if ('caches' in window) caches.keys().then(names => names.forEach(n => caches.delete(n)));
        window.location.reload();
    }
}

const PWA_SETUP = {
    init() { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js'); }
};