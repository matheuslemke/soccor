<script lang="ts">
  import { onMount } from 'svelte'

  type Match = {
    time: string
    homeTeam: string
    awayTeam: string
  }

  let matches: Match[] = [
    {
      time: '08:00',
      homeTeam: 'São Paulo',
      awayTeam: 'Parmera'
    }
  ]
  let date = new Date().toISOString().split('T')[0]

  const handleChangeDate = ({ target }) => {
    date = target.value
  }

  const updateMatches = async () => {
    const url = `https://v3.football.api-sports.io/fixtures?date=${date}`

    const response = await fetch(url) //, { headers })

    if (response.ok) {
      const responseBody = await response.json()
      mapToMatches(responseBody.response)
      return
    }

    return {
      status: response.status,
      props: {
        article: response.ok && (await response.json())
      }
    }
  }

  const mapToMatches = (responseMatches: any[]) => {
    matches = responseMatches.map((m) => {
      return {
        time: new Date(m.fixture.date).toString().slice(16, 21),
        homeTeam: m.teams.home.name,
        awayTeam: m.teams.away.name
      }
    }) as Match[]
  }

  onMount(() => {
    updateMatches()
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
          <input type="date" value={date} on:change={handleChangeDate} />
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
