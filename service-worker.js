// /* ==========================================
//    EXPENSE TRACKER
//    service-worker.js
//    Version 1.0
// ========================================== */

// const CACHE_NAME = "expense-tracker-v9";

// const FILES_TO_CACHE = [

//     "/",
//     "/index.html",
//     "/manifest.json",

//     "/css/style.css",
//     "/css/dark.css",
//     "/css/animation.css",

//     "/js/app.js",

//     "/js/utils.js",
//     "/js/storage.js",
//     "/js/theme.js",
//     "/js/chart.js",
//     "/js/filter.js",
//     "/js/export.js",
//     "/js/expense.js",

//     "/assets/images/app-icon-192.png",

//     // "/assets/images/favicon.png",

//     // "/assets/images/app-icon-512.png"

// ];


// /* ==========================================
//    INSTALL
// ========================================== */

// self.addEventListener("install", event => {

//     console.log("Service Worker Installed");

//     event.waitUntil(

//         caches.open(CACHE_NAME)

//         .then(cache => {

//             return cache.addAll(FILES_TO_CACHE);

//         })

//     );

//     // self.skipWaiting();

// });


// /* ==========================================
//    ACTIVATE
// ========================================== */

// self.addEventListener("activate", event => {

//     console.log("Service Worker Activated");

//     event.waitUntil(

//         caches.keys()

//         .then(keys => {

//             return Promise.all(

//                 keys.map(key => {

//                     if(key !== CACHE_NAME){

//                         return caches.delete(key);

//                     }
//                 })
//             );
//         })
//     );
//     self.clients.claim();
// });


// /* ==========================================
//    FETCH
// ========================================== */

// self.addEventListener("fetch", event => {

//     if (!event.request.url.startsWith('http')) return; 

//     event.respondWith(

//         caches.match(event.request)

//         .then(response => {

//             if(response){

//                 return response;

//             }

//             return fetch(event.request)

//             .then(networkResponse => {

//                 if(
//                     !networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic"

//                 ){
//                     return networkResponse;
//                 }

//                 const responseClone =

//                     networkResponse.clone();

//                 caches.open(CACHE_NAME)

//                 .then(cache => {

//                     cache.put(

//                         event.request,

//                         responseClone
//                     );
//                 });
//                 return networkResponse;
//             });
//         })
//     );
// });


// /* ==========================================
//    MESSAGE
// ========================================== */

// self.addEventListener("message", event => {
//     if(event.data === "skipWaiting"){
//         self.skipWaiting();
//     }
// });

// // Listen for messages from the main application
// self.addEventListener('message', (event) => {
//   if (event.data && event.data.action === 'skipWaiting') {
//     self.skipWaiting(); // Forces the waiting service worker to become active
//   }
// });







/* ==========================================
   EXPENSE TRACKER
   service-worker.js
   Version 1.0
========================================== */

const CACHE_NAME = "expense-tracker-v3";

// 🚀 DYNAMIC ROUTING FIX: Automatically pre-pends your GitHub repository name if online
const IS_GITHUB = self.location.hostname.includes('github.io');
const REPO_PREFIX = IS_GITHUB ? '/Expense_Tracker' : '';

const FILES_TO_CACHE = [
    `${REPO_PREFIX}/`,
    `${REPO_PREFIX}/index.html`,
    `${REPO_PREFIX}/manifest.json`,

    `${REPO_PREFIX}/css/style.css`,
    `${REPO_PREFIX}/css/dark.css`,
    `${REPO_PREFIX}/css/animation.css`,

    `${REPO_PREFIX}/js/app.js`,
    `${REPO_PREFIX}/js/utils.js`,
    `${REPO_PREFIX}/js/storage.js`,
    `${REPO_PREFIX}/js/theme.js`,
    `${REPO_PREFIX}/js/chart.js`,
    `${REPO_PREFIX}/js/filter.js`,
    `${REPO_PREFIX}/js/export.js`,
    `${REPO_PREFIX}/js/expense.js`,

    `${REPO_PREFIX}/assets/images/app-icon-192.png`
];


/* ==========================================
   INSTALL
========================================== */
self.addEventListener("install", event => {
    console.log("Service Worker Installed");
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});


/* ==========================================
   ACTIVATE
========================================== */
self.addEventListener("activate", event => {
    console.log("Service Worker Activated");
    event.waitUntil(
        caches.keys()
        .then(keys => {
            return Promise.all(
                keys.map(key => {
                    if(key !== CACHE_NAME){
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});


/* ==========================================
   FETCH
========================================== */
self.addEventListener("fetch", event => {
    if (!event.request.url.startsWith('http')) return; 

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if(response){
                return response;
            }

            return fetch(event.request)
            .then(networkResponse => {
                if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic"){
                    return networkResponse;
                }

                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME)
                .then(cache => {
                    cache.put(event.request, responseClone);
                });
                return networkResponse;
            });
        })
    );
});


/* ==========================================
   MESSAGE (Cleaned & Unified)
========================================== */
self.addEventListener("message", event => {
    if (event.data) {
        // Handles both plain string "skipWaiting" and object { action: 'skipWaiting' } calls safely
        if (event.data === "skipWaiting" || event.data.action === "skipWaiting") {
            console.log("Service worker forced to skipWaiting via manual user click.");
            self.skipWaiting();
        }
    }
});

