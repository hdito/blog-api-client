<script setup lang="ts">
import { PostResponseSchema } from '@/schemas/postResponseSchema'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { DateTime } from 'luxon'

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
  <div
    class="w-fit rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
    v-else-if="status === 'error'"
  >
    Error has occured on loading post. Try again later.
  </div>
  <div v-else>
    <h2 class="text-2xl font-bold">{{ post!.title }}</h2>
    <p class="mb-4 italic">
      {{ DateTime.fromISO(post!.createdAt).toLocaleString(DateTime.DATE_FULL) }}
    </p>
    <p class="whitespace-pre" v-if="post!.content">{{ post!.content }}</p>
  </div>
</template>
