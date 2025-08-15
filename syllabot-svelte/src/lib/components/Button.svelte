<script lang="ts">
  export let type: 'button' | 'submit' = 'button';
  export let variant: 'primary' | 'secondary' = 'primary';
</script>

<button type={type} class="btn btn-{variant}">
  <slot />
</button>
