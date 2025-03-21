// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");



// Initialize the Firebase app in the service worker by passing in your config
firebase.initializeApp({
    apiKey: "AIzaSyDdS7z2rmcCPmBvq-Vg9cjG2Qi9RkEn11k",
    authDomain: "rocketsalesapp-e5b34.firebaseapp.com",
    projectId: "rocketsalesapp-e5b34",
    storageBucket: "rocketsalesapp-e5b34.firebasestorage.app",
    messagingSenderId: "535225261505",
    appId: "1:535225261505:web:39daca905e6be076452340",
    // measurementId: "G-WPTGQRQ57W"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Optionally, handle background messages (if any)
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});
