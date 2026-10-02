if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        
        // 🚀 SAFE PATH GENERATOR FOR GITHUB PAGES & LOCALHOST
        let swPath = '/service-worker.js';
        if (window.location.hostname.includes('github.io')) {
            // Extracts "Expense_Tracker" correctly from your URL path
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            const repoName = pathSegments[0] || 'Expense_Tracker';
            swPath = `/${repoName}/service-worker.js`;
        }

        navigator.serviceWorker.register(swPath)
        .then(registration => {
            console.log("Service Worker Registered");
            
            // Checks for updates correctly using the verified registration
            registration.update();

            if (registration.waiting) {
                showUpdateBanner(registration.waiting);
            }

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateBanner(newWorker);
                    }
                });
            });
        })
        .catch(error => console.error("Service Worker Failed", error));
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload();
            refreshing = true;
        }
    });
}

function showUpdateBanner(worker) {
    const banner = document.getElementById('update-banner');
    const reloadBtn = document.getElementById('reload-btn');
    
    if (banner) banner.style.display = 'flex';
    if (reloadBtn) {
        reloadBtn.onclick = null;
        reloadBtn.onclick = () => {
            worker.postMessage({ action: 'skipWaiting' });
        };
    }
}