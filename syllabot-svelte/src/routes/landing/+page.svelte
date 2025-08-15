<script lang="ts">
import TitleBar from '$lib/components/TitleBar.svelte';
import Panel from '$lib/components/Panel.svelte';
import { onMount } from 'svelte';
import { db } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

let schools: { id: string; name: string; location?: string }[] = [];
let loading = true;
let error = '';

onMount(async () => {
  try {
    const snap = await getDocs(collection(db, 'schools'));
    schools = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    error = 'Failed to load schools.';
  } finally {
    loading = false;
  }
});
</script>

<TitleBar title="Choose a school" />
<main class="max-w-xl mx-auto mt-8">
  <Panel>
    <h3 class="text-lg font-semibold mb-4">Schools</h3>
    {#if loading}
      <p>Loading…</p>
    {:else if error}
      <p class="text-red-500">{error}</p>
    {:else if schools.length === 0}
      <p>No schools found.</p>
    {:else}
      <ul class="space-y-2">
        {#each schools as school}
          <li class="list-none flex justify-between items-center">
            <div>
              <div class="font-bold">{school.name}</div>
              {#if school.location}
                <div class="text-gray-500 text-sm">{school.location}</div>
              {/if}
            </div>
            <a class="btn btn-primary" href={"/management?schoolID=" + school.id}>Manage</a>
          </li>
        {/each}
      </ul>
    {/if}
  </Panel>
</main>
