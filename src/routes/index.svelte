<script lang="ts">
  import { onMount } from 'svelte'
  import { CollapsibleCard } from 'svelte-collapsible'
  import { dialogs } from 'svelte-dialogs'
  import { environment } from '$lib/env/env'
  import AddLeagueDialog from '../components/AddLeagueDialog.svelte'

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
  let addLeagueOpened = true
  let leagues = [{ name: 'liga 1' }, { name: 'liga 2' }]

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

  const handleAddLeagueClick = () => {
    dialogs.modal(AddLeagueDialog, { leagues })
    // dialogs
    //   .prompt([{ name: 'aa', label: 'Liga', type: 'select' }], null)
    //   .then((a) => console.log(a))
  }
  const handleAddLeagueSubmit = () => {}

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
        <input class="button" type="submit" value="Pesquisar" />
      </div>
      <CollapsibleCard>
        <div slot="header" class="header row">
          <div class="one column">
            <svg
              style="tran"
              width="20"
              height="20"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              ><path d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div class="eleven columns">
            <h3>Brasileirão</h3>
          </div>
        </div>
        <div slot="body">
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
      </CollapsibleCard>
    </div>
    {addLeagueOpened}
    <div class="container add-league">
      <p />
      <button class="button-primary" on:click={handleAddLeagueClick}>Adicionar liga</button>
    </div>
  </body>
</template>
