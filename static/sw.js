const staticCacheName = 'site-static-v2'
//const dynamicCacheName = 'site-dynamic-v1'

const staticAssets = [
    '/',
    '/offline',
    //'/index.html',
    //'/app.js',
    //'/app/css',
    //'/pages_index.js',
    //'/pages_index.css',
    '/_nuxt/runtime.js',
    '/_nuxt/commons.app.js',
    '/_nuxt/vendors.app.css',
    '/_nuxt/vendors.app.js',
    '/_nuxt/app.css',
    '/_nuxt/app.js',
    '/_nuxt/pages_index.css',
    '/_nuxt/pages_index.js',
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
]

//---------------------------------------------------//
//INSTALL
//---------------------------------------------------//
self.addEventListener('install', evt =>{
    console.log('SW has been installed')
    evt.waitUntil(
        caches.open(staticCacheName)
        .then(cache =>{
            console.log('Caching Shell Assets')
            cache.addAll(staticAssets)
        })
    )
})

//---------------------------------------------------//
//ACTIVATE
//---------------------------------------------------//
self.addEventListener('activate', evt =>{
    console.log('SW has been activated')
    evt.waitUntil(
        caches.keys().then(keys => {
            console.log(keys) 
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            )
        })


    )
})

//---------------------------------------------------//
//FETCH
//---------------------------------------------------//
// self.addEventListener('fetch', evt =>{
//     console.log('Fetch Event', evt)
//     evt.respondWith(
//         caches.match(evt.request)
//         .then(cacheRes =>{
//             return cacheRes || fetch(evt.request)
//             // .then(fetchRes =>{
//             //     return caches.open(dynamicCacheName)
//             //     .then( cache =>{
//             //         cache.put(evt.request.url, fetchRes.clone())
//             //         return fetchRes
//             //     })
//             // })
//         })
//     )
// })

//---------------------------------------------------//
//DISPLAY PUSH NOTIFICATION 
//---------------------------------------------------//
self.addEventListener('push', function(event) {
    const message = JSON.parse(event.data.text());
    const title = message.title;
    //const url = message.url;
    const options = {
      body: message.body,
      icon: message.icon,
      //badge: message.badge,
      //data: url,
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });
  
//---------------------------------------------------//
//NOTIFICATION HANDLER
//---------------------------------------------------//
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://taskeroo-firebaseapp.com')
    )
  })


//---------------------------------------------------//
//NOTIFICATION CLOSE
//---------------------------------------------------//
self.addEventListener('notificationclose', evt =>{
    let notification = evt.notification
    let primaryKey = notification.data.primaryKey
    Console.log('Closed notification' + primaryKey)
})

//---------------------------------------------------//
//NOTIFICATION HANDLER
//---------------------------------------------------//
// self.addEventListener('notificationclick', evt =>{
//     let notification = evt.notification
//     let action = evt.action
//     actions === 'close' ? notification.close : ClientHttp2Session.openWindow('https://taskeroo-firebaseapp.com')
// })


