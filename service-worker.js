/* ==========================================
   EXPENSE TRACKER
   service-worker.js
   Version 1.0
========================================== */

const CACHE_NAME = "expense-tracker-v1";

const FILES_TO_CACHE = [

    "/",
    "index.html",
    "manifest.json",

    "css/style.css",
    "css/dark.css",
    "css/animation.css",

    "js/utils.js",
    "js/storage.js",
    "js/theme.js",
    "js/chart.js",
    "js/filter.js",
    "js/export.js",
    "js/expense.js",

    "assets/images/favicon.png",
    "assets/images/app-icon-192.png",
    "assets/images/app-icon-512.png"

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

    self.skipWaiting();

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

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if(response){

                return response;

            }

            return fetch(event.request)

            .then(networkResponse => {

                if(

                    !networkResponse ||

                    networkResponse.status !== 200 ||

                    networkResponse.type !== "basic"

                ){

                    return networkResponse;

                }

                const responseClone =

                    networkResponse.clone();

                caches.open(CACHE_NAME)

                .then(cache => {

                    cache.put(

                        event.request,

                        responseClone

                    );

                });

                return networkResponse;

            });

        })

    );

});


/* ==========================================
   MESSAGE
========================================== */

self.addEventListener("message", event => {

    if(event.data === "skipWaiting"){

        self.skipWaiting();

    }

});