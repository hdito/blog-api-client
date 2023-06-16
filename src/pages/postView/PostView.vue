<script setup lang="ts">
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import PostComments from './PostComments.vue'
import { DateTime } from 'luxon'
import { usePostQuery } from './usePostQuery'

const { post, postLoadingStatus } = usePostQuery()
</script>

<template>
  <LoadingSpinner v-if="postLoadingStatus === 'loading'" class="m-auto text-2xl" />
  <ErrorWrapper v-else-if="postLoadingStatus === 'error'">
    Error has occured on loading post. Try again later.
  </ErrorWrapper>
  <div v-else>
    <h2 class="text-2xl font-bold">{{ post!.title }}</h2>
    <p class="mb-4 italic">
      {{ DateTime.fromISO(post!.createdAt).toLocaleString(DateTime.DATE_FULL) }}
    </p>
    <p class="whitespace-pre-wrap" v-if="post!.content">{{ post!.content }}</p>
    <PostComments />
  </div>
</template>
