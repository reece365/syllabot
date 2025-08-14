import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut, initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";

// Reuse same config as chat
const firebaseConfig = {
  apiKey: "AIzaSyA2E_U5N09zCVHdIecaFuIeDRuUWNX8xNg",
  authDomain: "mysyllabusbot.firebaseapp.com",
  projectId: "mysyllabusbot",
  storageBucket: "mysyllabusbot.appspot.com",
  messagingSenderId: "326497831637",
  appId: "1:326497831637:web:34d6cdc687a3b6a281f05c"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);

// Initialize Auth with robust persistence fallbacks.
let auth;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence]
  });
} catch (e) {
  // initializeAuth throws if called more than once for an app; fall back to getAuth
  auth = getAuth(firebaseApp);
}

const ADMIN_UID = '21iGoj0VLDeLXyPq7K6aGDrVQIo2';

const state = {
  schools: [],
  selectedSchoolId: null,
  selectedClassId: null,
  user: null,
};

function $(id) { return document.getElementById(id); }

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function loadSchools() {
  const sel = $('schoolSelect');
  sel.innerHTML = '<option value="" disabled selected>Loading schools…</option>';

  const snap = await getDocs(collection(db, 'schools'));
  state.schools = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  sel.innerHTML = '<option value="" disabled selected>Select a school…</option>' +
    state.schools.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  // Preselect from query if provided
  const fromQuery = getQueryParam('schoolID');
  if (fromQuery && state.schools.some(s => s.id === fromQuery)) {
    sel.value = fromQuery;
    state.selectedSchoolId = fromQuery;
    $('classesPanel').style.display = state.user ? 'block' : 'none';
    await loadClasses();
  }
}

async function loadClasses() {
  if (!state.selectedSchoolId) return;
  if (!state.user) {
    $('classesList').innerHTML = '<p class="hint">Please sign in to see classes.</p>';
    return;
  }
  const list = $('classesList');
  list.innerHTML = 'Loading classes…';

  const classesRef = collection(db, 'schools', state.selectedSchoolId, 'classes');
  let q;

  if (state.user.uid === ADMIN_UID) {
    // Admin sees all classes
    q = query(classesRef);
  } else {
    // Regular users only see classes where they are an editor.
    // This implicitly handles the case of empty editor lists for non-admins.
    q = query(classesRef, where('editors', 'array-contains', state.user.email));
  }

  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  list.innerHTML = '';
  if (!items.length) {
    list.innerHTML = '<p class="hint">No classes found that you are authorized to edit.</p>';
    return;
  }

  for (const c of items) {
    const div = document.createElement('div');
    div.className = 'item';
    const chatUrl = `/chat?schoolID=${encodeURIComponent(state.selectedSchoolId)}&courseID=${encodeURIComponent(c.id)}`;
    div.innerHTML = `<div>
        <div style="font-weight:700">${c.name || '(untitled)'} <span class="hint">${c.section || ''}</span></div>
        <div class="hint">Syllabus: ${c.syllabus_uri || '—'}</div>
      </div>
      <div class="item-actions">
        <a href="${chatUrl}" target="_blank" class="btn secondary">Chat</a>
        <button data-id="${c.id}" class="editBtn">Edit</button>
      </div>`;
    list.appendChild(div);
  }

  // wire edit buttons
  list.querySelectorAll('.editBtn').forEach(btn => btn.addEventListener('click', () => startEdit(btn.dataset.id)));
}

function ensureAuthorized() {
  if (!state.user) throw new Error('Not signed in');
}

function clearForm() {
  $('classForm').reset();
  $('deleteClassBtn').style.display = 'none';
  state.selectedClassId = null;
  $('editorTitle').textContent = 'Create / Edit Class';
}

function startCreate() {
  ensureAuthorized();
  clearForm();
  $('editorPanel').style.display = 'block';
}

async function startEdit(classId) {
  ensureAuthorized();
  const ref = doc(db, 'schools', state.selectedSchoolId, 'classes', classId);
  const snap = await getDoc(ref);
  const data = snap.data();
  if (!data) return;

  // No client-side auth check here. We rely on the query in loadClasses
  // to only show editable classes, and on Firestore rules for write protection.

  state.selectedClassId = classId;
  $('editorPanel').style.display = 'block';
  $('editorTitle').textContent = `Editing: ${data.name || classId}`;
  $('className').value = data.name || '';
  $('classSection').value = data.section || '';
  $('syllabusUri').value = data.syllabus_uri || '';
  $('classNotes').value = data.notes || '';
  const editors = Array.isArray(data.editors) ? data.editors : [];
  $('classEditors').value = editors.join(', ');
  $('deleteClassBtn').style.display = 'inline-block';
}

async function saveClass(e) {
  e.preventDefault();
  ensureAuthorized();
  if (!state.selectedSchoolId) return;

  const editorsField = $('classEditors').value || '';
  const editors = editorsField
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0 && e.includes('@'));

  const isNewClass = !state.selectedClassId;
  if (isNewClass && state.user.email && !editors.includes(state.user.email)) {
    editors.push(state.user.email);
    $('classEditors').value = editors.join(', ');
  }

  const payload = {
    name: $('className').value.trim(),
    section: $('classSection').value.trim(),
    syllabus_uri: $('syllabusUri').value.trim(),
    notes: $('classNotes').value,
    editors,
    updatedAt: new Date().toISOString(),
  };

  const col = collection(db, 'schools', state.selectedSchoolId, 'classes');
  try {
    if (state.selectedClassId) {
      await setDoc(doc(col, state.selectedClassId), payload, { merge: true });
    } else {
      const created = await addDoc(col, payload);
      state.selectedClassId = created.id;
    }
    $('editorPanel').style.display = 'none';
    await loadClasses();
  } catch (err) {
    console.error("Save failed:", err);
    alert("Save failed. You may not have permission to edit this class.");
  }
}

async function deleteClass() {
  ensureAuthorized();
  if (!state.selectedSchoolId || !state.selectedClassId) return;
  await deleteDoc(doc(db, 'schools', state.selectedSchoolId, 'classes', state.selectedClassId));
  $('editorPanel').style.display = 'none';
  await loadClasses();
}

function wireUi() {
  $('schoolSelect').addEventListener('change', async (e) => {
    state.selectedSchoolId = e.target.value;
    if (state.user) {
        $('classesPanel').style.display = 'block';
        await loadClasses();
    }
  });

  $('newClassBtn').addEventListener('click', startCreate);
  $('classForm').addEventListener('submit', saveClass);
  $('cancelEditBtn').addEventListener('click', () => { $('editorPanel').style.display = 'none'; });
  $('deleteClassBtn').addEventListener('click', deleteClass);
}

async function initManagementApp() {
  // Wire up the main UI elements
  wireUi();

  // Set up the sign-out button
  const signOutBtn = $('signOutBtn');
  if (signOutBtn) {
    signOutBtn.style.display = 'block';
    signOutBtn.addEventListener('click', () => signOut(auth));
  }

  // Update the auth status display
  const authStatus = $('authStatus');
  if (authStatus) {
    authStatus.textContent = `Signed in as ${state.user.email}`;
  }

  // Load the initial school data
  await loadSchools();
}

document.addEventListener('DOMContentLoaded', () => {
  // Wait for initial auth state to resolve before deciding to redirect.
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, store the user state and initialize the app.
      state.user = user;
      initManagementApp();
    } else {
      // Not signed in; redirect to auth with callback to this page.
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth/?redirect=${redirectUrl}`;
    }
  });
});
