<script lang="ts">
  export let message: string;
  export let from: string = 'bot';
</script>

<div class="flex mb-2" class:justify-end={from === 'user'}>
  <div class="max-w-xs px-4 py-2 rounded-lg shadow text-sm"
    class:bg-blue-100={from === 'bot'}
    class:bg-green-100={from === 'user'}>
    {message}
  </div>
</div>
