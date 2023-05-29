<script setup lang="ts">
import { useField } from 'vee-validate'
import { ref } from 'vue'

const props = defineProps<{ name: string }>()

const { value, handleBlur, handleChange } = useField(props.name, undefined)

const isShow = ref(false)
</script>

<template>
  <div class="flex">
    <input
      :name="name"
      :id="name"
      :value="value"
      @change="handleChange"
      @blur="handleBlur"
      class="flex-1 rounded-l-md"
      :type="isShow ? 'text' : 'password'"
    />
    <button class="w-14 rounded-r-md bg-black text-white" type="button" @click="isShow = !isShow">
      {{ isShow ? 'Hide' : 'Show' }}
    </button>
  </div>
</template>
