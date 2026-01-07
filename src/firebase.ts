import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔴 請替換成你剛剛在 Firebase Console 複製的內容
const firebaseConfig = {
  apiKey: "AIzaSyAazH9Qov60ZBzFrU5U2mPJMQW2ZY3A0gw",
  authDomain: "nordic-trek-2026.firebaseapp.com",
  projectId: "nordic-trek-2026",
  storageBucket: "nordic-trek-2026.firebasestorage.app",
  messagingSenderId: "969656227512",
  appId: "1:969656227512:web:cee6779367b6a13c3d064d",
  measurementId: "G-TB21YT3WHY"
};

const app = initializeApp(firebaseConfig);
// 匯出資料庫實體
export const db = getFirestore(app);