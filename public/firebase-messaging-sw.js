importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAhSzyz6Wi6QDNlNF-ajlyVf4dvF0gp21o",
  authDomain: "prapan-app-store.firebaseapp.com",
  projectId: "prapan-app-store",
  storageBucket: "prapan-app-store.firebasestorage.app",
  messagingSenderId: "35967167202",
  appId: "1:35967167202:web:7de764c690e94f52f50cbb",
  measurementId: "G-91EZRTEKMS"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Optional: define background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
