<script setup lang="ts">
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { signInFormSchema } from '../schemas/signInFormSchema'

const router = useRouter()

const { setUser } = useUserStore()

const validationSchema = toTypedSchema(signInFormSchema)

const { handleSubmit } = useForm({ validationSchema })

const onSubmit = handleSubmit((values) => {
  blogApi
    .url('/sign-in')
    .post(values)
    .badRequest((error) => {
      if (typeof error.json.error === 'string') {
        formError.value = error.json.error
      } else formError.value = 'Unknwon error has occured. Try again later'
    })
    .json((response) => {
      if (typeof response.token === 'string') {
        setUser(
          response.token,
          () => {
            formError.value = null
            router.push('/')
          },
          () => {
            formError.value = 'Unknwon error has occured. Try again later'
          }
        )
      }
    })
    .catch(() => {
      formError.value = 'Unknwon error has occured. Try again later'
    })
})

const formError = ref<string | null>(null)

const isSignInViaEmail = ref(false)
</script>

<template>
  <div v-if="formError">
    <h3>{{ formError }}</h3>
  </div>
  <h1>Sign in</h1>
  <form action="" :validation-schema="validationSchema" @submit.prevent="onSubmit">
    <div>
      <template v-if="isSignInViaEmail">
        <label for="email">Email</label>
        <Field type="email" name="email" id="email" />
        <ErrorMessage name="email" />
      </template>
      <template v-else>
        <label for="username">Username</label>
        <Field type="text" name="username" id="username" />
        <ErrorMessage name="username" />
      </template>
    </div>
    <div>
      <label for="password">Password</label>
      <Field type="password" name="password" id="password" />
      <ErrorMessage name="password" />
    </div>
    <button>Sign in</button>
  </form>
  <button v-if="isSignInViaEmail" @click="isSignInViaEmail = false">Or sign in via username</button>
  <button v-else @click="isSignInViaEmail = true">Or sign in via email</button>
  <h2>Haven't got an account? <RouterLink to="/sign-up">Sign up</RouterLink></h2>
</template>
