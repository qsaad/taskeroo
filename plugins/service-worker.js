/*
if ("serviceWorker" in navigator){
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js")
      .then(function(reg) {
        console.log('SW has been registered', reg.scope);
      .catch(function(err) {
        console.warn('SW could not be registered', err);
      });
    })
}

if (!('PushManager' in window)) {
  // Push isn't supported on this browser, disable or hide UI.
  console.log('Push Notification not supported by this browser' + navigator.userAgent)
  //return;
}
else{
  console.log('Push Notification supported by this browser' + navigator.userAgent)
}

*/


// const check = () => {
//   if (!('serviceWorker' in navigator)) {
//     throw new Error('No Service Worker support!')
//   }
//   if (!('PushManager' in window)) {
//     throw new Error('No Push API Support!')
//   }
// }

// const registerServiceWorker = async () => {
//   const swRegistration = await navigator.serviceWorker.register('/sw.js'); //notice the file name
//   return swRegistration;
// }

// const requestNotificationPermission = async () => {
//   const permission = await window.Notification.requestPermission();
//   // value of permission can be 'granted', 'default', 'denied'
//   // granted: user has accepted the request
//   // default: user has dismissed the notification permission popup by clicking on x
//   // denied: user has denied the request.
//   if(permission !== 'granted'){
//       throw new Error('Permission not granted for Notification')
//   }
//}

// const main = async () => {
//   check();
//   await registerServiceWorker()
//   //await requestNotificationPermission()
// }

// main()

