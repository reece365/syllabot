<script lang="ts">
import TitleBar from '$lib/components/TitleBar.svelte';
import Panel from '$lib/components/Panel.svelte';
import Button from '$lib/components/Button.svelte';
import { onMount } from 'svelte';
import { db, auth } from '$lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { signOut as fbSignOut } from 'firebase/auth';

let schools: { id: string; name: string }[] = [];
let selectedSchool = '';
let classes: { id: string; name: string }[] = [];
let showClasses = false;
let loadingSchools = true;
let loadingClasses = false;
let error = '';

onMount(async () => {
  try {
    loadingSchools = true;
    const snap = await getDocs(collection(db, 'schools'));
    schools = snap.docs.map(d => {
      const data = d.data();
      return { id: d.id, name: data.name || 'Unnamed School' };
    });
  } catch (e) {
    error = 'Failed to load schools.';
  } finally {
    loadingSchools = false;
  }
});

async function selectSchool(e: Event) {
  const target = e.target as HTMLSelectElement | null;
  if (target) {
    selectedSchool = target.value;
    showClasses = true;
    await loadClasses();
  }
}

async function loadClasses() {
  if (!selectedSchool) return;
  loadingClasses = true;
  try {
    const classesRef = collection(db, 'schools', selectedSchool, 'classes');
    const q = query(classesRef);
    const snap = await getDocs(q);
    classes = snap.docs.map(d => {
      const data = d.data();
      return { id: d.id, name: data.name || 'Unnamed Class' };
    });
  } catch (e) {
    error = 'Failed to load classes.';
  } finally {
    loadingClasses = false;
  }
}

async function newClass() {
  // TODO: Implement new class creation
}

async function signOut() {
  await fbSignOut(auth);
  window.location.href = '/auth';
}
</script>

<TitleBar title="Syllabot Management" showSignOut={true} onSignOut={signOut} />
<main class="max-w-xl mx-auto mt-8">
  <Panel>
    <h3 class="text-lg font-semibold mb-2">Select School</h3>
    <p class="text-gray-500 mb-4">Choose your institution to manage its classes.</p>
    <select class="w-full border rounded px-3 py-2" on:change={selectSchool} bind:value={selectedSchool}>
      <option value="" disabled selected>{loadingSchools ? 'Loading schools…' : 'Select a school…'}</option>
      {#each schools as school}
        <option value={school.id}>{school.name}</option>
      {/each}
    </select>
  </Panel>
  {#if showClasses}
    <Panel>
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold">Classes</h3>
        <Button on:click={newClass}>New Class</Button>
      </div>
      {#if loadingClasses}
        <p>Loading classes…</p>
      {:else if error}
        <p class="text-red-500">{error}</p>
      {:else if classes.length === 0}
        <p>No classes found.</p>
      {:else}
        <ul class="space-y-2">
          {#each classes as c}
            <li>{c.name}</li>
          {/each}
        </ul>
      {/if}
    </Panel>
  {/if}
</main>
