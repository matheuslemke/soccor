<script lang="ts">
  import { onMount } from 'svelte'
  import { environment } from '$lib/env/env'

  type Match = {
    time: string
    homeTeam: string
    awayTeam: string
    leagueId: number
  }

  const BRASILEIRAO = 71
  let matches: Match[] = []
  let brasileiraoMatches: Match[] = []
  let date = new Date().toISOString().split('T')[0]

  const handleChangeDate = ({ target }) => {
    date = target.value
  }

  const updateMatches = async () => {
    const url = `https://v3.football.api-sports.io/fixtures?date=${date}`
    const headers = { 'x-apisports-key': `${environment.apiToken}` }

    const response = await fetch(url, { headers })

    if (response.ok) {
      const responseBody = await response.json()
      mapToMatches(responseBody.response)
      fillBrasileirao()
      return
    }

    return {
      status: response.status,
      props: {
        article: response.ok && (await response.json())
      }
    }
  }

  const fillBrasileirao = () => {
    brasileiraoMatches = matches.filter((m) => m.leagueId === BRASILEIRAO)
  }

  const mapToMatches = (responseMatches: any[]) => {
    matches = responseMatches.map((m) => {
      return {
        time: new Date(m.fixture.date).toString().slice(16, 21),
        homeTeam: m.teams.home.name,
        awayTeam: m.teams.away.name,
        leagueId: m.league.id
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
        <input type="date" value={date} on:change={handleChangeDate} />
        <input class="button-primary" type="submit" value="Pesquisar" />
      </div>
      <div class="row">
        <h3>Brasileirão</h3>
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
          {#each brasileiraoMatches as match}
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
