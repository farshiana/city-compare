<template>
  <v-container class="cities-comparison d-flex justify-center">
    <CityItem v-for="city in citiesStore.cities" :key="city.id" :city="city" />
  </v-container>
</template>

<script setup>
import CityItem from './CityItem.vue'
import { useCitiesStore } from '@/store'

const citiesStore = useCitiesStore()
</script>
