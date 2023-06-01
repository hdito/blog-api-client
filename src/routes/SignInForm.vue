<script setup lang="ts">
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { signInFormSchema } from '../schemas/signInFormSchema'
import PasswordInput from '@/components/PasswordInput.vue'
import { badRequestResponseSchema } from '@/schemas/badRequestResponseSchema'
import { signInResponseSchema } from '@/schemas/signInResponseSchema'

const router = useRouter()
const { setUser } = useUserStore()

const validationSchema = toTypedSchema(signInFormSchema)
const { handleSubmit } = useForm({ validationSchema })
const onSubmit = handleSubmit((values) => {
  formErrors.value = null
  blogApi
    .url('/sign-in')
    .post(values)
    .badRequest((error) => {
      const badRequest = badRequestResponseSchema.parse(error.json)
      formErrors.value = badRequest.data.map((error) => error.message)
    })
    .json((response) => {
      const token = signInResponseSchema.parse(response).data.token
      try {
        setUser(token)
        router.push('/')
      } catch {
        formErrors.value = 'Unknown error has occured. Try again later'
      }
    })
    .catch(() => {
      formErrors.value = 'Unknown error has occured. Try again later'
    })
})
const formErrors = ref<string[] | string | null>(null)

const isSignInViaEmail = ref(false)
</script>

<template>
  <div
    class="mb-4 w-fit rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
    v-if="formErrors"
  >
    <h2 class="font-bold" v-if="typeof formErrors === 'string'">{{ formErrors }}</h2>
    <template v-else>
      <h2 class="font-bold">Your data has followind errors:</h2>
      <ul class="list-inside list-disc">
        <li v-for="error in formErrors" :key="error">
          {{ error }}
        </li>
      </ul>
    </template>
  </div>
  <form
    class="mb-4 flex flex-col gap-4"
    action=""
    :validation-schema="validationSchema"
    @submit.prevent="onSubmit"
  >
    <div>
      <div class="flex flex-col gap-2" v-if="isSignInViaEmail">
        <label for="email">Email</label>
        <Field class="self-start rounded-md" type="email" name="email" id="email" />
        <ErrorMessage
          class="self-start rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
          name="email"
        />
      </div>
      <div class="flex flex-col gap-2" v-else>
        <label for="username">Username</label>
        <Field class="self-start rounded-md" type="text" name="username" id="username" />
        <ErrorMessage
          class="self-start rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
          name="username"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <label for="password">Password</label>
      <PasswordInput class="self-start" name="password" />
      <ErrorMessage
        class="self-start rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
        name="password"
      />
    </div>
    <button class="self-start rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md">
      Sign in
    </button>
  </form>
  <button
    class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md"
    v-if="isSignInViaEmail"
    @click="isSignInViaEmail = false"
  >
    Or sign in via username
  </button>
  <button
    class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md"
    v-else
    @click="isSignInViaEmail = true"
  >
    Or sign in via email
  </button>
  <h2 class="mt-4">
    Haven't got an account? <RouterLink class="font-bold" to="/sign-up">Sign up</RouterLink>
  </h2>
</template>
