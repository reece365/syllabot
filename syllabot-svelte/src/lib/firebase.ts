import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA2E_U5N09zCVHdIecaFuIeDRuUWNX8xNg",
  authDomain: "mysyllabusbot.firebaseapp.com",
  projectId: "mysyllabusbot",
  storageBucket: "mysyllabusbot.appspot.com",
  messagingSenderId: "326497831637",
  appId: "1:326497831637:web:34d6cdc687a3b6a281f05c"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
