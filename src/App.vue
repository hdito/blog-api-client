<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-amber-50 text-sky-900">
    <AppHeader />
    <main class="m-auto w-full flex-1 px-4 pb-8 md:min-w-[500px] md:max-w-prose">
      <RouterView />
    </main>
  </div>
</template>
