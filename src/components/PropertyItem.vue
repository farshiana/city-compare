<template>
  <v-list-item-title>{{ value }}</v-list-item-title>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  city: {
    type: Object,
    required: true
  },
  property: {
    type: Object,
    required: true
  }
})
const value = computed(() => {
  const found = props.city[props.property.key]
  if (!found) return props.city.loading ? '' : 'N/A'

  return props.property.format ? props.property.format(found.value) : found.value
})
</script>
