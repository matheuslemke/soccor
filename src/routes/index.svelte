<script lang="ts">
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

  let matches: Match[] = []
  let date = new Date().toISOString().split('T')[0]
  let selectedLeague
  let leagues = []

  const handleChangeDate = ({ target }) => {
    date = target.value
  }

  const fetchFixtures = async () => {
    const url = `${environment.apiUrl}/fixtures?date=${date}`
    const headers = { 'x-apisports-key': `${environment.apiToken}` }

    const response = await fetch(url, { headers })

    if (response.ok) {
      const responseBody = await response.json()
      await mapToMatches(responseBody.response)
      await fillMatches()
      return
    }

    return {
      status: response.status,
      props: {
        article: response.ok && (await response.json())
      }
    }
  }

  const fillMatches = async () => {
    leagues.forEach((league) => {
      league.matches = matches.filter((match) => match.leagueId === league.external_id)
    })
    leagues = leagues // force compiler that object has changed
  }

  const mapToMatches = async (responseMatches: any[]) => {
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
          fetchFixtures()
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }
</script>

<template>
  <body>
    <div use:fetchLeagues class="container">
      <p />
      <div class="row">
        <input type="date" value={date} on:change={handleChangeDate} />
        <input class="button" type="submit" value="Pesquisar" on:click={fetchFixtures} />
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
                {#if league.matches && league.matches.length > 0}
                  {#each league.matches as match}
                    <tr>
                      <td>{match.time}</td>
                      <td>{match.homeTeam}</td>
                      <td>{match.awayTeam}</td>
                    </tr>
                  {/each}
                {:else}
                  <td colspan="3">
                    <h6>Sem partidas nessa data</h6>
                  </td>
                {/if}
              </tbody>
            </table>
          </div>
        </CollapsibleCard>
      {/each}
    </div>
    <div class="container add-league">
      <p />
      <button class="button-primary" on:click={handleAddLeagueClick}>Adicionar liga</button>
    </div>
  </body>
</template>
