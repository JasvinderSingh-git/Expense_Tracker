// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", () => {
//         navigator.serviceWorker.register("/service-worker.js")
//         .then(registration => {
//             console.log("Service Worker Registered");

//             // Force check the server for an updated service-worker.js file
//             // registration.update();

//             // If a new worker is already waiting in the background, show the banner
//             if (registration.waiting) {
//                 showUpdateBanner(registration.waiting);
//             }

//             // If a new worker is found downloading, watch it until it's ready
//             registration.addEventListener('updatefound', () => {
//                 const newWorker = registration.installing;
//                 newWorker.addEventListener('statechange', () => {
//                     if (newWorker.state === 'installed') {
//                         showUpdateBanner(newWorker);
//                     }
//                 });
//             });
//         })
//         .catch(error => console.error("Service Worker Failed", error));
//     });

//     // Auto-reload the tab once the new service worker officially takes over
//     let refreshing = false;
//     navigator.serviceWorker.addEventListener('controllerchange', () => {
//         if (!refreshing) {
//             window.location.reload();
//             refreshing = true;
//         }
//     });
// }

// // Simple function to reveal the banner and hook up the button click
// function showUpdateBanner(worker) {
//     const banner = document.getElementById('update-banner');
//     const reloadBtn = document.getElementById('reload-btn');
    
//     if (banner) banner.style.display = 'flex';
//     if (reloadBtn) {
//         reloadBtn.onclick = () => {
//             worker.postMessage({ action: 'skipWaiting' });
//         };
//     }
// }


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js")
        .then(registration => {
            console.log("Service Worker Registered");

            // Check for updates every time the page loads
            registration.update();

            // SITUATION A: A new update is already downloaded and waiting in the background
            if (registration.waiting) {
                showUpdateBanner(registration.waiting);
            }

            // SITUATION B: A new update is found downloading right now
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    // CRITICAL FIX: Only show the banner if it finished installing 
                    // AND there is an old worker already controlling the page (navigator.serviceWorker.controller)
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateBanner(newWorker);
                    }
                });
            });
        })
        .catch(error => console.error("Service Worker Failed", error));
    });

    // 🔄 This only triggers AFTER the user clicks the button and skipWaiting() completes
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload();
            refreshing = true;
        }
    });
}

// Function to handle the banner display and click logic
function showUpdateBanner(worker) {
    const banner = document.getElementById('update-banner');
    const reloadBtn = document.getElementById('reload-btn');
    
    if (banner) banner.style.display = 'flex'; // Show banner
    
    if (reloadBtn) {
        // Clear any previous click listeners to avoid bugs
        reloadBtn.onclick = null; 
        
        // 🛑 The page will ONLY refresh when this click event happens!
        reloadBtn.onclick = () => {
            worker.postMessage({ action: 'skipWaiting' });
        };
    }
}
