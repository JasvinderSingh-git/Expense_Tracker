if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js")
        .then(registration => {
            console.log("Service Worker Registered");

            // Force check the server for an updated service-worker.js file
            registration.update();

            // If a new worker is already waiting in the background, show the banner
            if (registration.waiting) {
                showUpdateBanner(registration.waiting);
            }

            // If a new worker is found downloading, watch it until it's ready
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        showUpdateBanner(newWorker);
                    }
                });
            });
        })
        .catch(error => console.error("Service Worker Failed", error));
    });

    // Auto-reload the tab once the new service worker officially takes over
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload();
            refreshing = true;
        }
    });
}

// Simple function to reveal the banner and hook up the button click
function showUpdateBanner(worker) {
    const banner = document.getElementById('update-banner');
    const reloadBtn = document.getElementById('reload-btn');
    
    if (banner) banner.style.display = 'flex';
    if (reloadBtn) {
        reloadBtn.onclick = () => {
            worker.postMessage({ action: 'skipWaiting' });
        };
    }
}
