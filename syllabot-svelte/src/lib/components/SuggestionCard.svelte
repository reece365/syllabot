<script lang="ts">
  export let suggestion: string;
  export let onClick: (() => void) | undefined;
</script>

<button
  type="button"
  class="w-full text-left bg-gray-100 rounded-lg px-4 py-2 mb-2 cursor-pointer hover:bg-gray-200"
  on:click={onClick}
>
  {suggestion}
</button>
