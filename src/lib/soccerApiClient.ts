import { environment } from '$lib/env/env'

export const fetchFixtures = (date: string) => {
  const url = `${environment.apiUrl}/fixtures?date=${date}`
  const headers = { 'x-apisports-key': `${environment.apiToken}` }

  return fetch(url, { headers })
}
