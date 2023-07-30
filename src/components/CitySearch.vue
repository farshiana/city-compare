<template>
  <v-container class="city-autocomplete d-flex d-justify-center">
    <v-autocomplete
      v-model="selectedCity"
      label="City name"
      placeholder="Enter city name..."
      item-title="displayName"
      item-value="id"
      prepend-inner-icon="mdi-city"
      :key="autocompleteKey"
      autofocus
      :clearable="!!searchTerm"
      :loading="citiesStore.isSearching"
      :items="citiesStore.searchResults"
      :error-messages="citiesStore.error ? [citiesStore.error] : []"
      :hide-no-data="!searchTerm"
      hide-selected
      @input="handleInput"
      @keydown.enter="handleSearch"
      @click:clear="handleInput"
    >
    </v-autocomplete>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCitiesStore } from '@/store'

const searchTerm = ref('')
const selectedCity = ref('')
const autocompleteKey = ref(0)

const citiesStore = useCitiesStore()

function handleInput(event) {
  searchTerm.value = event.target.value
  citiesStore.searchResults = []
  citiesStore.error = ''
}

function handleSearch() {
  citiesStore.searchCities(searchTerm.value)
}

watch(selectedCity, (cityId) => {
  if (!cityId) return

  const city = citiesStore.searchResults.find((c) => c.id === cityId)
  citiesStore.addCity(city)

  selectedCity.value = ''
  searchTerm.value = ''
  citiesStore.searchResults = []
  autocompleteKey.value += 1 // force re-render to clear autocomplete
})
</script>

<style scoped>
.city-autocomplete {
  max-width: 600px;
}
</style>
