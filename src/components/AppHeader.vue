<script setup lang="ts">
import { useUserStore } from '@/userStore'
import { onBeforeMount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const userStore = useUserStore()
const { extractUserFromLocalStorage, logOut: logOutUser } = userStore

onBeforeMount(() => {
  extractUserFromLocalStorage()
})

const router = useRouter()

function logOut() {
  logOutUser()
  router.push('/')
}
</script>

<template>
  <header class="flex items-center gap-4 px-4 py-2">
    <div class="flex items-baseline gap-8">
      <RouterLink class="text-4xl font-bold" to="/">Blog</RouterLink>
      <RouterLink
        v-if="userStore.user?.role === 'author' || userStore.user?.role === 'admin'"
        to="/my-posts"
        active-class="underline decoration-2 underline-offset-2"
        >My posts</RouterLink
      >
    </div>
    <div class="ml-auto flex items-center gap-2">
      <p class="font-bold" v-if="userStore.user">{{ userStore.user.displayName }}</p>
      <button
        class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md"
        v-if="userStore.user"
        @click="logOut"
      >
        Log out
      </button>
      <RouterLink
        class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md"
        v-else
        to="/sign-in"
        >Sign in</RouterLink
      >
    </div>
  </header>
</template>
