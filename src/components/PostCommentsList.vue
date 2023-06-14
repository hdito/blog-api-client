<script setup lang="ts">
import { useComments } from '@/composables/useComments'
import { useDeleteComment } from '@/composables/useDeleteComment'
import { useUserStore } from '@/userStore'
import { DateTime } from 'luxon'
import IcRoundDeleteForever from '~icons/ic/round-delete-forever'

const userStore = useUserStore()

const { deleteComment } = useDeleteComment()
const { comments, commentsStatus } = useComments()
</script>

<template>
  <LoadingSpinner v-if="commentsStatus === 'loading'" />
  <ErrorWrapper v-else-if="commentsStatus === 'error'"
    >Error occured on loading comments</ErrorWrapper
  >
  <div v-else class="flex flex-col gap-4">
    <div v-for="comment in comments" :key="comment._id" class="relative">
      <p class="font-bold">{{ comment.author.displayName }}</p>
      <p class="text-sm italic">
        {{ DateTime.fromISO(comment.createdAt).toLocaleString(DateTime.DATE_FULL) }}
      </p>
      <p class="whitespace-pre-wrap">{{ comment.body }}</p>
      <button
        v-if="userStore.user?.id === comment.author._id || userStore.user?.role === 'admin'"
        aria-label="Delete"
        class="absolute right-0 top-1/2 -translate-y-1/2 text-2xl"
        @click="() => deleteComment(comment._id)"
        title="Delete comment"
      >
        <IcRoundDeleteForever />
      </button>
    </div>
  </div>
</template>
