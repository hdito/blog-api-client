<script setup lang="ts">
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { PostWithAuthorSchema } from '@/schemas/postWithAuthorSchema'
import { successResponseWrapper } from '@/schemas/successResponseWrapper'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { z } from 'zod'

const { data, status } = useQuery({
  queryKey: ['posts'],
  queryFn: () =>
    blogApi.get('/posts?populate=author').json((data) => {
      const parsedData = successResponseWrapper(
        z.object({ posts: z.array(PostWithAuthorSchema) })
      ).parse(data)
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
      <span>
        By <span class="font-bold">{{ post.author!.username }}</span> •
      </span>
      <span class="italic">
        {{ DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL) }}
      </span>
      <p v-if="post.description">{{ post.description }}</p>
    </div>
  </div>
</template>
