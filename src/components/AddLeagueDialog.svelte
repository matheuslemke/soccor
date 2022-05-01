<script lang="ts">
  import { DialogContent } from 'svelte-dialogs'
  export let leagues = []
</script>

<DialogContent>
  <h5 slot="header">Adicionar liga</h5>
  <svelte:fragment slot="body">
    <select>
      {#each leagues as league}
        <option value={league.name}>{league.name}</option>
      {/each}
    </select>
  </svelte:fragment>
</DialogContent>
