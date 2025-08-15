<script lang="ts">
import TitleBar from '$lib/components/TitleBar.svelte';
import Panel from '$lib/components/Panel.svelte';
import ChatBubble from '$lib/components/ChatBubble.svelte';
import SuggestionCard from '$lib/components/SuggestionCard.svelte';
import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
import { onMount } from 'svelte';
import { db } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

let messages = [
  { from: 'bot', message: "Hello, I'm Syllabot! I can answer questions about your class, help you understand assignments, and more! Type a message below or click a suggestion to get started!" }
];
let loading = false;
let input = '';
const suggestions = [
  "What's the grading policy?",
  "When are office hours?"
];

let courseTitle = '';

onMount(async () => {
  // Get schoolID and courseID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const schoolID = urlParams.get('schoolID');
  const courseID = urlParams.get('courseID');
  if (schoolID && courseID) {
    const docRef = doc(db, 'schools', schoolID, 'classes', courseID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      courseTitle = data.name || '';
      // Optionally, set initial message or context
    }
  }
});

async function sendMessage(msg: string) {
  if (!msg) return;
  messages = [...messages, { from: 'user', message: msg }];
  input = '';
  loading = true;
  // TODO: Integrate with Vertex AI or backend
  setTimeout(() => {
    messages = [...messages, { from: 'bot', message: 'This is a placeholder response.' }];
    loading = false;
  }, 1000);
}
</script>

<TitleBar title="Chat with Syllabot" />
<main class="max-w-xl mx-auto mt-8">
  <Panel>
    <div class="mb-4">
      {#each messages as m}
        <ChatBubble message={m.message} from={m.from} />
      {/each}
      {#if loading}
        <LoadingIndicator />
      {/if}
    </div>
    <div class="mb-4 flex gap-2">
      {#each suggestions as suggestion}
        <SuggestionCard {suggestion} onClick={() => sendMessage(suggestion)} />
      {/each}
    </div>
    <form class="flex gap-2" on:submit|preventDefault={() => sendMessage(input)}>
      <input class="flex-1 border rounded px-3 py-2" bind:value={input} placeholder="Type your message..." />
      <button class="btn btn-primary" type="submit">Send</button>
    </form>
  </Panel>
</main>
