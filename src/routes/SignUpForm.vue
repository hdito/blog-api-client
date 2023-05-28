<script setup lang="ts">
import { signUpFormSchema } from '@/schemas/signUpFormSchema'
import { blogApi } from '@/utils/blogApi'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const validationSchema = toTypedSchema(signUpFormSchema)

const { handleSubmit } = useForm({ validationSchema })

const onSubmit = handleSubmit((values) => {
  blogApi
    .url('/sign-up')
    .post(values)
    .badRequest((error) => {
      console.dir(error)
      ;(error.json as { error: { path: string; msg: string }[] }).error.forEach((error) => {
        if (formErrors.value === null) {
          formErrors.value = [error.msg]
          return
        }
        formErrors.value.push(error.msg)
        formStatus.value = 'error'
      })
    })
    .res(() => (formStatus.value = 'success'))
    .catch(() => {
      formStatus.value = 'error'
      if (formErrors.value !== null) formErrors.value = null
    })
})

const formStatus = ref<'success' | 'error' | null>(null)
const formErrors = ref<string[] | null>(null)
</script>

<template>
  <div v-if="formStatus === 'success'">
    Signed up successfully! Now you can <a href="/sign-in">sign in</a>
  </div>
  <div v-else-if="formStatus === 'error'">
    <h3>Errors on submission</h3>
    <ul v-if="formErrors">
      <li v-for="error in formErrors" :key="error">{{ error }}</li>
    </ul>
    <h3 v-else>Unknown error has occured. Try again later</h3>
  </div>
  <h1>Sign up</h1>
  <form action="" @submit.prevent="onSubmit">
    <div>
      <label for="username">Username</label>
      <Field type="text" name="username" id="username" />
      <ErrorMessage name="username" />
    </div>
    <div>
      <label for="email">Email</label>
      <Field type="text" name="email" id="email" />
      <ErrorMessage name="email" />
    </div>
    <div>
      <label for="password">Password</label>
      <Field type="password" name="password" id="password" />
      <ErrorMessage name="password" />
    </div>
    <div>
      <label for="password2">Repeat password</label>
      <Field type="password" name="password2" id="password2" />
      <ErrorMessage name="password2" />
    </div>
    <button>Sign up</button>
  </form>
  <h2>Already got an account? <RouterLink to="/sign-in">Sign in</RouterLink></h2>
</template>
