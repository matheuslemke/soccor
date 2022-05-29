import { environment } from '$lib/env/env'

const fetchFixtures = (date: string) => {
  const url = `${environment.apiUrl}/fixtures?date=${date}`
  const headers = { 'x-apisports-key': `${environment.apiToken}` }

  return fetch(url, { headers })
}

const fetchLeagues = (countryCode: string) => {
  const url = `${environment.apiUrl}/leagues?code=${countryCode}&season=2022`
  const headers = { 'x-apisports-key': `${environment.apiToken}` }

  return fetch(url, { headers })
}

export { fetchFixtures, fetchLeagues }
