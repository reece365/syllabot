<script lang="ts">
import TitleBar from '$lib/components/TitleBar.svelte';
import Panel from '$lib/components/Panel.svelte';
import FormField from '$lib/components/FormField.svelte';
import Button from '$lib/components/Button.svelte';
import { auth } from '$lib/firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { goto } from '$app/navigation';

let email = '';
let password = '';
let error = '';
let loading = false;

function getRedirectUrl() {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('redirect') || '/management';
  }
  return '/management';
}

async function signIn() {
  error = '';
  loading = true;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    error = err.message || String(err);
  } finally {
    loading = false;
  }
}

async function signUp() {
  error = '';
  loading = true;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    error = err.message || String(err);
  } finally {
    loading = false;
  }
}

async function signInWithGoogle() {
  error = '';
  loading = true;
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (err: any) {
    error = err.message || String(err);
  } finally {
    loading = false;
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    goto(getRedirectUrl());
  }
});
</script>

<TitleBar title="Sign In" />
<main class="max-w-md mx-auto mt-8">
  <Panel>
    <img src="/syllabot-wordmark-light.svg" alt="Syllabot" class="h-8 mb-4 mx-auto" />
    <h3 class="text-lg font-semibold mb-2">Sign In</h3>
    <p class="text-gray-500 mb-4">Sign in to manage your classes.</p>
    <form on:submit|preventDefault={signIn} class="space-y-4">
      <FormField label="Email" type="email" bind:value={email} onInput={e => {
        const target = e.target as HTMLInputElement | null;
        if (target) email = target.value;
      }} />
      <FormField label="Password" type="password" bind:value={password} onInput={e => {
        const target = e.target as HTMLInputElement | null;
        if (target) password = target.value;
      }} />
      <div class="flex gap-2">
        <Button type="submit">Sign In</Button>
        <Button type="button" variant="secondary" on:click={signUp}>Sign Up</Button>
      </div>
    </form>
    <div class="mt-4">
      <Button type="button" variant="secondary" on:click={signInWithGoogle}>Sign in with Google</Button>
    </div>
    {#if error}
      <p class="text-red-500 mt-2">{error}</p>
    {/if}
  </Panel>
</main>
