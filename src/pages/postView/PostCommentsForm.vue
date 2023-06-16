<script setup lang="ts">
import { useUserStore } from '@/userStore'
import { useCommentForm } from './useCommentForm'

const userStore = useUserStore()

const { createCommentStatus, onSubmitComment } = useCommentForm()
</script>

<template>
  <RouterLink
    v-if="!userStore.user"
    to="/sign-in"
    class="self-start rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
  >
    Sign in to comment
  </RouterLink>
  <template v-else>
    <form action="" method="post" @submit="onSubmitComment">
      <CustomFormField input-type="textarea" :rows="3" name="body" label="Your comment" />
      <button
        class="mt-2 flex h-8 w-28 items-center justify-center self-start rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
      >
        <LoadingSpinner v-if="createCommentStatus === 'loading'" />
        <span v-else>Comment</span>
      </button>
    </form>
  </template>
</template>
