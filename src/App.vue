<template>
  <v-app>
    <v-main>
      <v-container class="d-flex justify-center align-center mt-16">
        <img alt="app logo" class="logo" src="./assets/logo.svg" width="82" height="82" />
        <h1>City Compare</h1>
      </v-container>
      <CitySearch />
      <CitiesList />
    </v-main>
  </v-app>
</template>

<script setup>
import CitySearch from './components/CitySearch.vue'
import CitiesList from './components/CitiesList.vue'
</script>
