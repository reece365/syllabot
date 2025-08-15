<script lang="ts">
  export let items: any[] = [];
  export let render: (item: any) => any;
</script>

<ul class="divide-y divide-gray-200">
  {#each items as item (item.id)}
    <li>{render(item)}</li>
  {/each}
</ul>
