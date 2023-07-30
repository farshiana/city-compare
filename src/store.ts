import { defineStore } from 'pinia'
import axios from 'axios'
import type { City } from '@/types'

export const useCitiesStore = defineStore('cities', {
  state: () => ({
    cities: [] as City[],
    isSearching: false,
    searchResults: [],
    error: ''
  }),
  actions: {
    async searchCities(searchTerm: string) {
      this.isSearching = true

      try {
        const response = await axios.get(
          `https://secure.geonames.org/searchJSON?q=${searchTerm}&maxRows=10&featureClass=P&username=citycompare`
        )

        this.searchResults = response.data.geonames.map((city: City) => ({
          id: city.geonameId,
          name: city.name,
          displayName: `${city.name}, ${city.countryName}`,
          loading: false,
          error: false
        }))
      } catch (error) {
        console.error(error)
        this.error = 'Error fetching cities'
      } finally {
        this.isSearching = false
      }
    },
    addCity(city: City) {
      const cityExists = this.cities.some((c: City) => c.id === city.id)
      if (cityExists) return

      this.cities.push(city)
      this.fetchCityData(city)
    },
    removecity(city: City) {
      const cityIndex = this.cities.findIndex((c: City) => c.id === city.id)
      if (cityIndex === -1) return

      this.cities.splice(cityIndex, 1)
    },
    async fetchCityData(city: City) {
      city.loading = true
      const cityIndex = this.cities.findIndex((c: City) => c.id === city.id)

      const query = `
        SELECT ?city ?cityLabel ?country ?countryLabel ?population ?timezoneLabel ?area ?postalCode
        WHERE {
          {
            ?city wdt:P1566 "${city.id}".
          }
          UNION
          {
            ?city wdt:P7197 "${city.id}".
          }
          ?city rdfs:label ?cityLabel.
          FILTER(LANG(?cityLabel) = "en").

          ?city wdt:P1082 ?population.

          ?city wdt:P17 ?country.
          ?country rdfs:label ?countryLabel.
          FILTER(LANG(?countryLabel) = "en").

          OPTIONAL {
            ?city wdt:P421 ?timezone.
            ?timezone rdfs:label ?timezoneLabel.
            FILTER(LANG(?timezoneLabel) = "en").
          }

          OPTIONAL {
            ?city wdt:P2046 ?area.
          }

          OPTIONAL {
            ?city wdt:P281 ?postalCode.
          }
        }
        LIMIT 1
      `

      try {
        const response = await axios.post(
          'https://query.wikidata.org/sparql',
          new URLSearchParams({
            query,
            format: 'json'
          })
        )

        const data = response.data.results.bindings
        if (data.length) {
          this.cities[cityIndex] = {
            ...city,
            ...data[0]
          }
        } else {
          this.cities[cityIndex].error = 'City not found in Wikidata'
        }
      } catch (error) {
        console.error(error)
        this.cities[cityIndex].error = 'Error fetching city data'
      } finally {
        this.cities[cityIndex].loading = false
      }
    }
  }
})
