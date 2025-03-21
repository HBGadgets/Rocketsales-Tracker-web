// import { messaging } from "./firebase-config";
// import { getToken } from "firebase/messaging";

// export const requestNotificationPermission = async () => {
//     const permission = await Notification.requestPermission();
    
//     if (permission === "granted") {
//         console.log("Notification permission granted.");
//         try {
//             const token = await getToken(messaging, { vapidKey: `process.meta.env.VITE_VAPID_KEY` });
//             if (token) {
//                 console.log("📂✅FCM Token:", token);
//             } else {
//                 console.log("No registration token available.");
//             }
//         } catch (error) {
//             console.error("Error getting token:", error);
//         }
//     } else {
//         console.log("Notification permission denied.");
//     }
// };
