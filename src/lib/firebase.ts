// Firebase (free Spark plan): Firestore database + Authentication for the admin.
// Web config values are public identifiers — access is controlled by firestore.rules.
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOdq0HFbfm8uwFaDtDZQr1myPiuidBF0I",
  authDomain: "rose-deco.firebaseapp.com",
  projectId: "rose-deco",
  storageBucket: "rose-deco.firebasestorage.app",
  messagingSenderId: "32147099129",
  appId: "1:32147099129:web:e89dc0f265cb705da18128",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Accounts allowed into /admin. Keep in sync with `isAdmin()` in firestore.rules.
 * Create these users in Firebase console → Authentication → Users.
 */
export const ADMIN_EMAILS = ["rozedecohq@gmail.com"];

export const isAdminEmail = (email?: string | null) => !!email && ADMIN_EMAILS.includes(email.toLowerCase());

