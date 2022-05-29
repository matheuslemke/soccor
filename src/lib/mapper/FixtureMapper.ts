import type { Fixture } from '$lib/types/Fixture'

class FixtureMapper {
  static fromApi = (responseFixturees: any[]) => {
    return responseFixturees.map((m) => {
      return {
        time: new Date(m.fixture.date).toString().slice(16, 21),
        homeTeam: m.teams.home.name,
        awayTeam: m.teams.away.name,
        leagueId: m.league.id
      }
    }) as Fixture[]
  }
}

export { FixtureMapper }
