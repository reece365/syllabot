import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence, browserPopupRedirectResolver } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2E_U5N09zCVHdIecaFuIeDRuUWNX8xNg",
  authDomain: "mysyllabusbot.firebaseapp.com",
  projectId: "mysyllabusbot",
  storageBucket: "mysyllabusbot.appspot.com",
  messagingSenderId: "326497831637",
  appId: "1:326497831637:web:34d6cdc687a3b6a281f05c"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with robust persistence fallbacks and popup resolver for web.
let auth;
auth = (() => {
  try {
    return initializeAuth(firebaseApp, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch (e) {
    return getAuth(firebaseApp);
  }
})();

function $(id) { return document.getElementById(id); }

function getRedirectUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('redirect') || '/management';
}

function showError(message) {
  const errEl = $('authError');
  errEl.textContent = message;
  errEl.style.display = 'block';
}

function wireAuth() {
  const provider = new GoogleAuthProvider();
  $('googleSignInBtn').addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      showError(err.message || String(err));
    }
  });

  const handleEmailAuth = async (isSignUp) => {
    const email = $('emailInput').value;
    const password = $('passwordInput').value;
    if (!email || !password) {
      showError('Please enter email and password.');
      return;
    }
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      showError(err.message);
    }
  };

  $('emailSignInBtn').addEventListener('click', () => handleEmailAuth(false));
  $('emailSignUpBtn').addEventListener('click', () => handleEmailAuth(true));

  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.replace(getRedirectUrl());
    }
  });
}

document.addEventListener('DOMContentLoaded', wireAuth);
