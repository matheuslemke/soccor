<script context="module">
  /** @type {import('./index').Load} */
  export async function load() {
    const today = new Date().toISOString().split('T')[0]
    const url = `https://v3.football.api-sports.io/fixtures/${today}`
    const response = await fetch(url)

    return {
      status: response.status,
      props: {
        article: response.ok && (await response.json())
      }
    }
  }
</script>

<script>
  import { onMount } from 'svelte'
  let matches = [
    {
      time: '08:00',
      homeTeam: 'São Paulo',
      awayTeam: 'Parmera'
    }
  ]
  onMount(() => {
    load()
  })
</script>

<template>
  <body>
    <div class="container">
      <p />
      <div class="row">
        <div class="four columns">
          <h3>Brasileirão</h3>
        </div>
        <div class="eight columns">
          <input type="date" />
          <input class="button-primary" type="submit" value="Pesquisar" />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Horário</th>
            <th>Casa</th>
            <th>Fora</th>
          </tr>
        </thead>
        <tbody>
          {#each matches as match}
            <tr>
              <td>{match.time}</td>
              <td>{match.homeTeam}</td>
              <td>{match.awayTeam}</td>
            </tr>
          {/each}
          <tr />
        </tbody>
      </table>
    </div>
  </body>
</template>
