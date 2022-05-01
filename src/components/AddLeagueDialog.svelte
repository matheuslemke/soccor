<script lang="ts">
  import { DialogContent } from 'svelte-dialogs'
  import { countries, leagues } from '../constants/constants'

  let selectedCountryCode = null
  export let selectedLeague = null
</script>

<DialogContent>
  <h5 slot="header">Adicionar liga</h5>
  <svelte:fragment slot="body">
    <div class="row">
      <select placeholder="Selecione o país" bind:value={selectedCountryCode}>
        <option selected disabled value={null}>Selecione o país</option>
        {#each countries as country}
          <option value={country.code}>{country.name}</option>
        {/each}
      </select>
    </div>

    <div class="row">
      <select disabled={!selectedCountryCode} bind:value={selectedLeague}>
        <option selected disabled value={null}>Selecione a liga</option>
        {#each leagues as league}
          {#if selectedCountryCode && league.countryCode === selectedCountryCode}
            <option value={league.name}>{league.name}</option>
          {/if}
        {/each}
      </select>

      <input type="text">
    </div>
  </svelte:fragment>
</DialogContent>
