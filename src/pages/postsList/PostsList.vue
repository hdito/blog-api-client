<script setup lang="ts">
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import PostCard from './PostCard.vue'
import { usePostsQuery } from './usePostsQuery'

const { posts, postsLoadingStatus } = usePostsQuery()
</script>

<template>
  <LoadingSpinner v-if="postsLoadingStatus === 'loading'" class="m-auto text-2xl" />
  <ErrorWrapper v-else-if="postsLoadingStatus === 'error'">
    Error has occured on loading posts. Try again later.
  </ErrorWrapper>
  <div v-else class="flex flex-col gap-4">
    <PostCard v-for="post in posts" :key="post._id" :post="post" />
  </div>
</template>
