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
  <header class="flex items-center justify-between px-4 py-2">
    <RouterLink class="text-4xl font-bold" to="/">Blog</RouterLink>
    <div class="flex items-center gap-4">
      <RouterLink
        class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md"
        v-if="!userStore.user"
        to="/sign-in"
        >Sign in</RouterLink
      >
      <RouterLink
        v-if="userStore.user?.role === 'author' || userStore.user?.role === 'admin'"
        to="/my-posts"
        active-class="underline decoration-2 underline-offset-2"
        >My posts</RouterLink
      >
      <button
        class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md"
        v-if="userStore.user"
        @click="logOut"
      >
        Log out
      </button>
    </div>
  </header>
</template>
