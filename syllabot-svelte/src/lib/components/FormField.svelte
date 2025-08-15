<script lang="ts">
  export let label: string;
  export let type: string = 'text';
  export let value: string = '';
  export let onInput: (e: Event) => void;
</script>

<label class="block mb-2">
  <span class="block text-sm font-medium mb-1">{label}</span>
  <input class="w-full border rounded px-3 py-2" type={type} bind:value on:input={onInput} />
</label>
