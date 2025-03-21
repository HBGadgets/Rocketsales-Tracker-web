import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { getAnalytics } from "firebase/analytics";
import toast from "react-hot-toast";
const audio = new Audio('../../public/notificationsount.wav');


const firebaseConfig = {
    apiKey: "AIzaSyDdS7z2rmcCPmBvq-Vg9cjG2Qi9RkEn11k",
    authDomain: "rocketsalesapp-e5b34.firebaseapp.com",
    projectId: "rocketsalesapp-e5b34",
    storageBucket: "rocketsalesapp-e5b34.firebasestorage.app",
    messagingSenderId: "535225261505",
    appId: "1:535225261505:web:39daca905e6be076452340",
    // measurementId: "G-WPTGQRQ57W"
  };

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging(app);


// A callback that components can register to get notification payloads.
let notificationCallback = null;
export const setOnNotificationReceivedCallback = (callback) => {
  notificationCallback = callback;
};


export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("🔔 Notification permission granted.");
            const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY });
            console.log("📌 FCM Token:", token);
        } else {
            console.log("🚫 Notification permission denied.");
            toast.error("You have blocked notifications. Please enable them in your browser settings.")
        }
    } catch (error) {
        console.error("🔥 Error requesting permission:", error);
    }
};
onMessage(messaging, (payload) => {
    console.log("📩 New Notification:", payload);
    audio.play().catch((error) =>
        console.error("Error playing notification sound:", error)
      );
       // Store or pass along the notification payload via the callback.
        if (notificationCallback) {
            notificationCallback(payload);
        }
    // alert(`🔔 ${payload.notification.title}: ${payload.notification.body}`);
    toast(`${payload.notification.title}\n${payload.notification.body}`, {
        duration: 2000,
        position: "top-center",
        icon: '🔔',
    });
    
});

