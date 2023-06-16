<script setup lang="ts">
import CustomFormField from '@/components/CustomFormField.vue'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { signUpFormSchema } from '@/schemas/formSchemas/signUpFormSchema'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { RouterLink } from 'vue-router'
import { useSignUp } from './useSignUp'

const { handleSubmit } = useForm({ validationSchema: toTypedSchema(signUpFormSchema) })

const onSubmit = handleSubmit((values) => {
  signUp(values)
})

const { signUp, signUpStatus, formServerError } = useSignUp()
</script>

<template>
  <div
    class="mb-4 w-fit rounded-md border border-emerald-900 bg-emerald-300/50 px-3 py-2 text-emerald-900"
    v-if="signUpStatus === 'success'"
  >
    Signed up successfully! Now you can
    <RouterLink to="/sign-in" class="font-bold">sign in</RouterLink>
  </div>
  <ErrorWrapper class="mb-4" v-else-if="signUpStatus === 'error'">
    <h3 class="font-bold" v-if="typeof formServerError === 'string'">{{ formServerError }}</h3>
    <template v-else>
      <h3 class="font-bold">Errors on signing up</h3>
      <ul class="list-inside list-disc">
        <li v-for="error in formServerError" :key="error">{{ error }}</li>
      </ul>
    </template>
  </ErrorWrapper>
  <form class="mb-4 flex flex-col gap-4" action="" @submit.prevent="onSubmit">
    <CustomFormField input-type="text" name="username" label="Username" />
    <CustomFormField input-type="email" name="email" label="Email" />
    <CustomFormField input-type="password" name="password" label="Password" />
    <CustomFormField input-type="password" name="password2" label="Repeat password" />
    <div class="flex items-center gap-4">
      <button
        class="flex h-8 w-24 items-center justify-center self-start rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
      >
        <LoadingSpinner v-if="signUpStatus === 'loading'" />
        <span v-else>Sign up</span>
      </button>
    </div>
  </form>
  <h2>Already got an account? <RouterLink class="font-bold" to="/sign-in">Sign in</RouterLink></h2>
</template>
