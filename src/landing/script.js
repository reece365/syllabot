import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2E_U5N09zCVHdIecaFuIeDRuUWNX8xNg",
  authDomain: "mysyllabusbot.firebaseapp.com",
  projectId: "mysyllabusbot",
  storageBucket: "mysyllabusbot.appspot.com",
  messagingSenderId: "326497831637",
  appId: "1:326497831637:web:34d6cdc687a3b6a281f05c"
};

const app = initializeApp(firebaseConfig, 'landing');
const db = getFirestore(app);

function $(id) { return document.getElementById(id); }

async function loadSchools() {
  const list = $('schoolsList');
  list.innerHTML = 'Loading…';
  const snap = await getDocs(collection(db, 'schools'));
  const schools = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  list.innerHTML = '';
  for (const s of schools) {
    const item = document.createElement('div');
    item.className = 'item';
    const manageUrl = `/management?schoolID=${encodeURIComponent(s.id)}`;
    item.innerHTML = `<div>
        <div style="font-weight:700">${s.name}</div>
        <div class="hint">${s.location || ''}</div>
      </div>
      <div>
        <a class="btn" href="${manageUrl}">Manage</a>
      </div>`;
    list.appendChild(item);
  }
}

document.addEventListener('DOMContentLoaded', loadSchools);
