<template>
  <v-container class="city">
    <v-card :title="city.name" :loading="city.loading">
      <v-card-text v-if="city.error" class="error-message">{{ city.error }}</v-card-text>
      <v-list v-else>
        <v-list-item v-for="property in properties" :key="property.key" :subtitle="property.label">
          <PropertyItem :city="city" :property="property" />
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-btn icon="mdi-delete" flat @click="handleDelete" />
      </template>
    </v-card>
  </v-container>
</template>

<script setup>
import { defineProps, reactive } from 'vue'
import numbro from 'numbro'
import PropertyItem from './PropertyItem.vue'
import { useCitiesStore } from '@/store'

const props = defineProps({
  city: {
    type: Object,
    required: true
  }
})

const formatPopulation = (value) => {
  const number = numbro(value)
  return number.format({ thousandSeparated: true })
}

const formatArea = (value) => `${value} km²`

const properties = reactive([
  { key: 'countryLabel', label: 'Country' },
  { key: 'population', label: 'Population', format: formatPopulation },
  { key: 'area', label: 'Area', format: formatArea },
  { key: 'timezoneLabel', label: 'Timezone' },
  { key: 'postalCode', label: 'Postal Code' }
])

const citiesStore = useCitiesStore()

function handleDelete() {
  citiesStore.removecity(props.city)
}
</script>

<style scoped>
.error-message {
  color: red;
}
</style>
