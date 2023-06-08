<script setup lang="ts">
import PasswordInput from './PasswordInput.vue'
import CustomErrorMessage from './CustomErrorMessage.vue'
import { Field } from 'vee-validate'

type CustomFormFieldProps = {
  label: string
  name: string
  inputType: 'email' | 'text' | 'password' | 'textarea'
  allowGrowth?: boolean
  cols?: number
  rows?: number
}

const props = withDefaults(defineProps<CustomFormFieldProps>(), { allowGrowth: false })
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="props.name">{{ props.label }}</label>
    <PasswordInput
      :class="props.allowGrowth ? '' : 'self-start'"
      :name="props.name"
      v-if="props.inputType === 'password'"
    />
    <Field
      v-else-if="props.inputType === 'textarea'"
      v-slot="{ value, handleChange, handleBlur }"
      :name="props.name"
    >
      <textarea
        class="resize-none rounded-md"
        :value="value"
        @input="handleChange"
        @blur="handleBlur"
        :id="props.name"
        :cols="props.cols ? props.cols : 30"
        :rows="props.rows ? props.rows : 10"
      />
    </Field>
    <Field
      v-else
      class="rounded-md"
      :class="props.allowGrowth ? '' : 'self-start'"
      :type="props.inputType"
      :id="props.name"
      :name="props.name"
    />
    <CustomErrorMessage :name="props.name" />
  </div>
</template>
