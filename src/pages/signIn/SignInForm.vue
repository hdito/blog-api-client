<script setup lang="ts">
import CustomFormField from '@/components/CustomFormField.vue'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { signInFormSchema } from '@/schemas/formSchemas/signInFormSchema'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useSignIn } from './useSignIn'

const { handleSubmit } = useForm({ validationSchema: toTypedSchema(signInFormSchema) })

const onSubmit = handleSubmit((values) => {
  signIn(values)
})

const isSignInViaEmail = ref(false)

const { signIn, signInStatus, formServerError } = useSignIn()
</script>

<template>
  <ErrorWrapper class="mb-4" v-if="signInStatus === 'error'">
    <h2 class="font-bold" v-if="typeof formServerError === 'string'">{{ formServerError }}</h2>
    <template v-else>
      <h2 class="font-bold">Your data has followind errors:</h2>
      <ul class="list-inside list-disc">
        <li v-for="error in formServerError" :key="error">
          {{ error }}
        </li>
      </ul>
    </template>
  </ErrorWrapper>
  <form class="mb-4 flex flex-col gap-4" action="" @submit.prevent="onSubmit">
    <CustomFormField input-type="email" label="Email" name="email" v-if="isSignInViaEmail" />
    <CustomFormField input-type="text" label="Username" name="username" v-else />
    <CustomFormField input-type="password" label="Password" name="password" />
    <button
      class="flex h-8 w-24 items-center justify-center self-start rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
    >
      <LoadingSpinner v-if="signInStatus === 'loading'" />
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
