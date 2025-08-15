<script lang="ts">
  export let title: string;
  export let showSignOut: boolean = false;
  export let onSignOut: (() => void) | undefined = undefined;
</script>

<div class="w-full flex items-center justify-between py-4 px-6 bg-white shadow">
  <div class="flex items-center gap-3">
    <img src="/syllabot-wordmark-light.svg" alt="Syllabot" class="h-8" />
    <h2 class="text-xl font-bold">{title}</h2>
  </div>
  {#if showSignOut}
    <button class="btn btn-secondary" on:click={onSignOut}>Sign out</button>
  {/if}
</div>
