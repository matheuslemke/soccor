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
      toast.push(error)
    }
  }
</script>

<template>
  <SvelteToast />
  <body>
    <div use:fetchLeagues class="container">
      <p />
      <div class="row date-search">
        <input type="date" value={date} on:change={handleChangeDate} />
        <button type="submit" on:click={fillFixtures}>Pesquisar</button>
      </div>
      {#each leagues as league}
        <CollapsibleCard>
          <div slot="header" class="header row">
            <div class="one column">
              <div class="fan-right-icon">
                <svg
                  style="tran"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div class="ten columns">
              <h3>{league.name}</h3>
            </div>
            <div class="one column">
              <button class="trash-icon">
                <div>
                  <svg class="svg-icon" viewBox="0 0 20 20">
                    <path
                      d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"
                    />
                  </svg>
                </div>
              </button>
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

<style lang="scss">
  div.date-search {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    input[type='date'] {
      margin: 0;
    }

    button[type='submit'] {
      margin: 0;
      margin-left: 15px;
    }
  }

  div.fan-right-icon {
    height: 36px;
    width: 36px;
    padding-top: 5px;
  }

  button.trash-icon {
    padding: 1px 6px;
    > div {
      display: flex;
      align-items: center;
      height: 18px;
      width: 18px;
    }
  }
</style>
