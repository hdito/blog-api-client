<script setup lang="ts">
import { PostResponseSchema } from '@/schemas/postResponseSchema'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { DateTime } from 'luxon'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useUserStore } from '@/userStore'
import { successResponseWrapper } from '@/schemas/successResponseWrapper'
import { z } from 'zod'
import { PostSchema } from '@/schemas/postSchema'

const userStore = useUserStore()

const route = useRoute()
const { postId } = route.params
const { type } = route.query
const { data: post, status } = useQuery({
  queryKey: ['posts', postId],
  queryFn: () => {
    if (type === 'preview') {
      return blogApi
        .auth(`Bearer ${userStore.userToken}`)
        .get(`/posts/${postId}?type=preview`)
        .json((data) => {
          const parsedData = successResponseWrapper(z.object({ post: PostSchema })).parse(data)
          return parsedData.data.post
        })
    }
    return blogApi.get(`/posts/${postId}`).json((data) => {
      const parsedData = PostResponseSchema.parse(data)
      return parsedData.data.post
    })
  }
})
</script>

<template>
  <LoadingSpinner v-if="status === 'loading'" class="m-auto text-2xl" />
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
