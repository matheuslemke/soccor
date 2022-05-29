<script lang="ts">
  import { DialogContent } from 'svelte-dialogs'
  import { supabase } from '$lib/client/supabaseClient'
  import { fetchLeagues } from '../lib/client/soccerApiClient'

  let countries = []
  let leagues = []
  let selectedCountryCode: string = null
  export let value

  const fillCountries = (node: any) => {
    fetchCountriesDb()
  }

  const fetchCountriesDb = async () => {
    const fetch = await supabase.from('country').select('id, code, name')

    if (fetch.status === 200) {
      countries = fetch.data
    }
  }

  const fetchLeaguesApi = async () => {
    leagues = [
      {
        league: {
          id: 76,
          name: 'Serie D',
          type: 'League',
          logo: 'https://media.api-sports.io/football/leagues/76.png'
        },
        country: {
          name: 'Brazil',
          code: 'BR',
          flag: 'https://media.api-sports.io/flags/br.svg'
        },
        seasons: [
          {
            year: 2022,
            start: '2022-04-17',
            end: '2022-07-16',
            current: true,
            coverage: {
              fixtures: {
                events: true,
                lineups: true,
                statistics_fixtures: false,
                statistics_players: false
              },
              standings: true,
              players: true,
              top_scorers: true,
              top_assists: true,
              top_cards: true,
              injuries: false,
              predictions: true,
              odds: true
            }
          }
        ]
      },
      {
        league: {
          id: 632,
          name: 'Supercopa do Brasil',
          type: 'Cup',
          logo: 'https://media.api-sports.io/football/leagues/632.png'
        },
        country: {
          name: 'Brazil',
          code: 'BR',
          flag: 'https://media.api-sports.io/flags/br.svg'
        },
        seasons: [
          {
            year: 2022,
            start: '2022-02-20',
            end: '2022-02-20',
            current: true,
            coverage: {
              fixtures: {
                events: true,
                lineups: true,
                statistics_fixtures: false,
                statistics_players: false
              },
              standings: false,
              players: false,
              top_scorers: false,
              top_assists: false,
              top_cards: false,
              injuries: false,
              predictions: true,
              odds: false
            }
          }
        ]
      },
      {
        league: {
          id: 631,
          name: 'Tocantinense',
          type: 'League',
          logo: 'https://media.api-sports.io/football/leagues/631.png'
        },
        country: {
          name: 'Brazil',
          code: 'BR',
          flag: 'https://media.api-sports.io/flags/br.svg'
        },
        seasons: [
          {
            year: 2022,
            start: '2022-01-22',
            end: '2022-04-10',
            current: true,
            coverage: {
              fixtures: {
                events: false,
                lineups: false,
                statistics_fixtures: false,
                statistics_players: false
              },
              standings: true,
              players: true,
              top_scorers: true,
              top_assists: true,
              top_cards: true,
              injuries: false,
              predictions: true,
              odds: false
            }
          }
        ]
      }
    ]
    // const response = await fetchLeagues(selectedCountryCode)

    // if (response.ok) {
    //   const responseBody = await response.json()
    //   leagues = responseBody.response
    // }
  }
</script>

<DialogContent>
  <h5 slot="header">Adicionar liga</h5>
  <svelte:fragment slot="body">
    <div use:fillCountries class="row">
      <select
        placeholder="Selecione o país"
        bind:value={selectedCountryCode}
        on:change={fetchLeaguesApi}
      >
        <option selected disabled value={null}>Selecione o país</option>
        {#each countries as country}
          <option value={country.code}>{country.name}</option>
        {/each}
      </select>
    </div>

    <div class="row">
      <select disabled={!selectedCountryCode} bind:value>
        <option selected disabled value={null}>Selecione a liga</option>
        {#each leagues as league}
          <option value={league}>{league.league.name}</option>
        {/each}
      </select>
    </div>
  </svelte:fragment>
</DialogContent>
