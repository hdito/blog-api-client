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
  <header>
    <RouterLink to="/">Blog</RouterLink>
    <RouterLink v-if="!userStore.user" to="/sign-in">Sign in</RouterLink>
    <RouterLink v-if="userStore.user?.role === 'author'" to="/my-posts">My posts</RouterLink>
    <button v-if="userStore.user" @click="logOut">Log out</button>
  </header>
</template>
