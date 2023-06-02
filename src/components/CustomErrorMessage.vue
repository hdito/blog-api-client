<script setup lang="ts">
import ErrorWrapper from './ErrorWrapper.vue'
import { ErrorMessage } from 'vee-validate'

type CustomErrorMessageProps = {
  name: string
}
const props = defineProps<CustomErrorMessageProps>()
</script>

<template>
  <ErrorMessage :name="props.name" v-slot="{ message }">
    <ErrorWrapper>
      {{ message }}
    </ErrorWrapper>
  </ErrorMessage>
</template>
