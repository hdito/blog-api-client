<script setup lang="ts">
import { PostsResponseSchema } from '@/schemas/postsResponseSchema'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { data, status } = useQuery({
  queryKey: ['posts'],
  queryFn: () =>
    blogApi.get('/posts').json((data) => {
      const parsedData = PostsResponseSchema.parse(data)
      return parsedData.data.posts
    })
})
</script>

<template>
  <LoadingSpinner v-if="status === 'loading'" class="m-auto text-2xl" />
  <ErrorWrapper v-else-if="status === 'error'">
    Error has occured on loading posts. Try again later.
  </ErrorWrapper>
  <div v-else class="flex flex-col gap-4">
    <div class="" v-for="post in data" :key="post._id">
      <a :href="`/posts/${post._id}`">
        <h2 class="text-xl font-bold">{{ post.title }}</h2>
      </a>
      <p class="italic">
        {{ DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL) }}
      </p>
      <p v-if="post.description">{{ post.description }}</p>
    </div>
  </div>
</template>
