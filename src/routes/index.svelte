<script lang="ts">
  import { onMount } from 'svelte'
  import { CollapsibleCard } from 'svelte-collapsible'
  import { dialogs, type PromptOptions } from 'svelte-dialogs'
  import { environment } from '$lib/env/env'
  import { supabase } from '$lib/supabaseClient'
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
  let selectedLeague
  let leagues = []

  const handleChangeDate = ({ target }) => {
    date = target.value
  }

  const updateMatches = async () => {
    const url = `${environment.apiUrl}/fixtures?date=${date}`
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
    const promptOptions: PromptOptions = {
      onHide: function (): void {},
      onHidden: function (): void {},
      onShow: function (): void {},
      onShown: function (): void {},
      resetButton: false,
      cancelButtonText: 'Cancelar',
      cancelButtonClass: 'button',
      submitButtonText: 'Adicionar',
      submitButtonClass: 'button-primary'
    }
    dialogs
      .prompt({ component: AddLeagueDialog, props: { value: null } }, promptOptions)
      .then((value) => {
        selectedLeague = value
        console.log(`add league ${value}`)
      })
  }
  const handleAddLeagueSubmit = () => {}

  const fetchLeagues = async () => {
    try {
      let fetchedLeagues = await supabase
        .from('saved_league')
        .select('id, external_id, name, country_code')

      if (fetchedLeagues) {
        const { error, status, data } = fetchedLeagues
        if (error || status === 406) {
          throw error
        }

        if (data) {
          leagues = data
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  onMount(() => {
    // fetchMatches()
    // updateMatches()
  })
</script>

<template>
  <body>
    <div use:fetchLeagues class="container">
      <p />
      <div class="row">
        <input type="date" value={date} on:change={handleChangeDate} />
        <input class="button" type="submit" value="Pesquisar" />
      </div>
      {#each leagues as league}
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
              <h3>{league.name}</h3>
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
      {/each}

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
    <div class="container add-league">
      <p />
      <button class="button-primary" on:click={handleAddLeagueClick}>Adicionar liga</button>
    </div>
  </body>
</template>
