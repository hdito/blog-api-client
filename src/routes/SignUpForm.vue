<script setup lang="ts">
import PasswordInput from '@/components/PasswordInput.vue'
import { badRequestResponseSchema } from '@/schemas/badRequestResponseSchema'
import { signUpFormSchema } from '@/schemas/signUpFormSchema'
import { blogApi } from '@/utils/blogApi'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
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
  <div
    class="mb-4 w-fit rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
    v-else-if="formStatus === 'error'"
  >
    <h3 class="font-bold" v-if="typeof formErrors === 'string'">{{ formErrors }}</h3>
    <template v-else>
      <h3 class="font-bold">Errors on signing up</h3>
      <ul class="list-inside list-disc">
        <li v-for="error in formErrors" :key="error">{{ error }}</li>
      </ul>
    </template>
  </div>
  <form class="mb-4 flex flex-col gap-4" action="" @submit.prevent="onSubmit">
    <div class="flex flex-col gap-2">
      <label for="username">Username</label>
      <Field class="self-start rounded-md" type="text" name="username" id="username" />
      <ErrorMessage
        class="self-start rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
        name="username"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="email">Email</label>
      <Field class="self-start rounded-md" type="email" name="email" id="email" />
      <ErrorMessage
        class="self-start rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
        name="email"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="password">Password</label>
      <PasswordInput class="self-start" name="password" />
      <ErrorMessage
        class="self-start rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
        name="password"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="password2">Repeat password</label>
      <PasswordInput class="self-start" name="password2" />
      <ErrorMessage
        class="self-start rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
        name="password2"
      />
    </div>
    <button class="self-start rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md">
      Sign up
    </button>
  </form>
  <h2>Already got an account? <RouterLink class="font-bold" to="/sign-in">Sign in</RouterLink></h2>
</template>
