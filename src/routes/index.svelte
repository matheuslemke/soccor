<script lang="ts">
  import { CollapsibleCard } from 'svelte-collapsible'
  import { dialogs, type PromptOptions } from 'svelte-dialogs'
  import { supabase } from '$lib/client/supabaseClient'
  import { fetchFixtures } from '$lib/client/soccerApiClient'
  import AddLeagueDialog from '../components/AddLeagueDialog.svelte'
  import type { Fixture } from '$lib/types/Fixture'
  import { FixtureMapper } from '$lib/mapper/FixtureMapper'
  import { LeagueMapper } from '../lib/mapper/LeagueMapper'
  import { SvelteToast, toast } from '@zerodevx/svelte-toast'

  let fixtures: Fixture[] = []
  let date = new Date().toISOString().split('T')[0]
  let leagues = []

  const handleChangeDate = ({ target }) => {
    date = target.value
  }

  const fillFixtures = async () => {
    const response: Response = await fetchFixtures(date)

    if (response.ok) {
      const responseBody = await response.json()
      fixtures = FixtureMapper.fromApi(responseBody.response)
      await fillLeagueMatches()
    }
  }

  const fillLeagueMatches = async () => {
    leagues.forEach((league) => {
      league.matches = fixtures.filter((match) => match.leagueId === league.external_id)
    })
    leagues = leagues // force compiler that object has changed
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
      .then(async (value) => {
        if (value) {
          const league = LeagueMapper.toDb(value[0])
          await supabase
            .from('saved_league')
            .upsert(league, { returning: 'minimal' })
            .throwOnError(true)
          fetchLeaguesDb()
        }
      })
      .catch((e) => {
        if (e.code && e.code === '23505') {
          toast.push('Liga já cadastrada!')
        }
      })
  }

  const fetchLeagues = (node: any) => {
    fetchLeaguesDb()
  }

  const fetchLeaguesDb = async () => {
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
          fillFixtures()
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }
</script>

<SvelteToast />
<template>
  <body>
    <div use:fetchLeagues class="container">
      <p />
      <div class="row">
        <input type="date" value={date} on:change={handleChangeDate} />
        <input class="button" type="submit" value="Pesquisar" on:click={fillFixtures} />
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
