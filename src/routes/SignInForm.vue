<script setup lang="ts">
import CustomFormField from '@/components/CustomFormField.vue'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import { badRequestResponseSchema } from '@/schemas/badRequestResponseSchema'
import { signInResponseSchema } from '@/schemas/signInResponseSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { signInFormSchema } from '@/schemas/formSchemas/signInFormSchema'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const { setUser } = useUserStore()

const validationSchema = toTypedSchema(signInFormSchema)
const { handleSubmit } = useForm({ validationSchema })
const onSubmit = handleSubmit((values) => {
  formErrors.value = null
  isSigningIn.value = true
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
    .finally(() => {
      isSigningIn.value = false
    })
})
const formErrors = ref<string[] | string | null>(null)

const isSignInViaEmail = ref(false)
const isSigningIn = ref(false)
</script>

<template>
  <ErrorWrapper class="mb-4" v-if="formErrors">
    <h2 class="font-bold" v-if="typeof formErrors === 'string'">{{ formErrors }}</h2>
    <template v-else>
      <h2 class="font-bold">Your data has followind errors:</h2>
      <ul class="list-inside list-disc">
        <li v-for="error in formErrors" :key="error">
          {{ error }}
        </li>
      </ul>
    </template>
  </ErrorWrapper>
  <form
    class="mb-4 flex flex-col gap-4"
    action=""
    :validation-schema="validationSchema"
    @submit.prevent="onSubmit"
  >
    <CustomFormField input-type="email" label="Email" name="email" v-if="isSignInViaEmail" />
    <CustomFormField input-type="text" label="Username" name="username" v-else />
    <CustomFormField input-type="password" label="Password" name="password" />
    <button
      class="flex h-8 w-24 items-center justify-center self-start rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
    >
      <LoadingSpinner v-if="isSigningIn" />
      <span v-else>Sign in</span>
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
