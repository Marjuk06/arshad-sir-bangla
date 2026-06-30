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

    mainContent.innerHTML = `<div class="px-4 pt-2">${headerHTML}<div class="grid grid-cols-1 gap-2">${categoriesHTML}</div></div>`;
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
                        <p class="text-xs text-gray-500 font-bold">Opening PDF...</p>
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
        const pdf = await loadingTask.promise;
        const container = document.getElementById('pdf-scroll-container');
        const loader = document.getElementById('pdf-loader');
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            // Render at high quality (2.0) so zooming doesn't blur
            const scale = 2.0; 
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement('canvas');
            canvas.className = 'pdf-page-canvas';
            const context = canvas.getContext('2d');
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            // Start at 100% width
            canvas.style.width = '100%';
            canvas.style.height = 'auto';

            container.appendChild(canvas);

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
        }
        
        loader.classList.add('hidden');

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