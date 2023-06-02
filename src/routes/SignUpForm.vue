<script setup lang="ts">
import CustomFormField from '@/components/CustomFormField.vue'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import { badRequestResponseSchema } from '@/schemas/badRequestResponseSchema'
import { signUpFormSchema } from '@/schemas/signUpFormSchema'
import { blogApi } from '@/utils/blogApi'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const validationSchema = toTypedSchema(signUpFormSchema)

const { handleSubmit } = useForm({ validationSchema })

const onSubmit = handleSubmit((values) => {
  formErrors.value = null
  formStatus.value = null
  blogApi
    .url('/sign-up')
    .post(values)
    .badRequest((error) => {
      const badRequest = badRequestResponseSchema.parse(error.json)
      formErrors.value = badRequest.data.map((error) => error.message)
      formStatus.value = 'error'
    })
    .res(() => (formStatus.value = 'success'))
    .catch(() => {
      formStatus.value = 'error'
      formErrors.value = 'Unknown error has occured on singing up. Try again later'
    })
})

const formStatus = ref<'success' | 'error' | null>(null)
const formErrors = ref<string[] | string | null>(null)
</script>

<template>
  <div
    class="mb-4 w-fit rounded-md border border-emerald-900 bg-emerald-300/50 px-3 py-2 text-emerald-900"
    v-if="formStatus === 'success'"
  >
    Signed up successfully! Now you can <a class="font-bold" href="/sign-in">sign in</a>
  </div>
  <ErrorWrapper class="mb-4" v-else-if="formStatus === 'error'">
    <h3 class="font-bold" v-if="typeof formErrors === 'string'">{{ formErrors }}</h3>
    <template v-else>
      <h3 class="font-bold">Errors on signing up</h3>
      <ul class="list-inside list-disc">
        <li v-for="error in formErrors" :key="error">{{ error }}</li>
      </ul>
    </template>
  </ErrorWrapper>
  <form class="mb-4 flex flex-col gap-4" action="" @submit.prevent="onSubmit">
    <CustomFormField input-type="text" name="username" label="Username" />
    <CustomFormField input-type="email" name="email" label="Email" />
    <CustomFormField input-type="password" name="password" label="Password" />
    <CustomFormField input-type="password" name="password2" label="Repeat password" />
    <button class="self-start rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md">
      Sign up
    </button>
  </form>
  <h2>Already got an account? <RouterLink class="font-bold" to="/sign-in">Sign in</RouterLink></h2>
</template>
