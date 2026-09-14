// ===== חיבור למאגר משותף (Firebase) =====
//
// כל עוד הקובץ הזה ריק מהגדרות, האפליקציה שומרת רק על המכשיר עצמו.
// כדי שכל הטאבלטים יראו את אותה רשימה:
//
// 1. באתר Firebase: Project settings (גלגל השיניים) -> Your apps -> האפליקציה שיצרתם
//    -> SDK setup and configuration -> בוחרים "Config".
// 2. מעתיקים את הקטע שמתחיל ב-   const firebaseConfig = {   ומסתיים ב-   };
// 3. מדביקים אותו בדיוק כמו שהוא מתחת לשורה הזו, ושומרים את הקובץ.

const firebaseConfig = {
  apiKey: "AIzaSyC37q-t9hFHXKLR3qW5IORe_JJ44Cwd5Ic",
  authDomain: "mekarer-d4b40.firebaseapp.com",
  projectId: "mekarer-d4b40",
  storageBucket: "mekarer-d4b40.firebasestorage.app",
  messagingSenderId: "54733118111",
  appId: "1:54733118111:web:f719671c87875ebe8ae0aa"
};

// ---- אל תשנו מכאן והלאה ----
window.FIREBASE_CONFIG = (typeof firebaseConfig !== 'undefined') ? firebaseConfig : null;
