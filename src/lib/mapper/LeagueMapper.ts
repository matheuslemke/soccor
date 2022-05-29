class LeagueMapper {
  static toDb = (league: any) => {
    const {
      league: { id: external_id, name, logo },
      country: { code: country_code }
    } = league
    return {
      external_id,
      name,
      country_code,
      logo,
      season: 2022
    }
  }
}

export { LeagueMapper }
