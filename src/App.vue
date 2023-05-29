<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-amber-50 text-sky-900">
    <AppHeader />
    <main class="m-auto min-w-[500px] max-w-prose flex-1 pb-4">
      <RouterView />
    </main>
  </div>
</template>
