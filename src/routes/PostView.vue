<script setup lang="ts">
import { PostResponseSchema } from '@/schemas/postResponseSchema'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { DateTime } from 'luxon'
import ErrorWrapper from '@/components/ErrorWrapper.vue'

const { postId } = useRoute().params

const { data: post, status } = useQuery({
  queryKey: ['posts', postId],
  queryFn: () =>
    blogApi.get(`/posts/${postId}`).json((data) => {
      const parsedData = PostResponseSchema.parse(data)
      return parsedData.data.post
    })
})
</script>

<template>
  <div v-if="status === 'loading'">Loading...</div>
  <ErrorWrapper v-else-if="status === 'error'">
    Error has occured on loading post. Try again later.
  </ErrorWrapper>
  <div v-else>
    <h2 class="text-2xl font-bold">{{ post!.title }}</h2>
    <p class="mb-4 italic">
      {{ DateTime.fromISO(post!.createdAt).toLocaleString(DateTime.DATE_FULL) }}
    </p>
    <p class="whitespace-pre" v-if="post!.content">{{ post!.content }}</p>
  </div>
</template>
