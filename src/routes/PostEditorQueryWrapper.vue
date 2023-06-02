<script setup lang="ts">
import { PostResponseSchema } from '@/schemas/postResponseSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import PostEditor from './PostEditor.vue'
import ErrorWrapper from '@/components/ErrorWrapper.vue'

const { postId } = useRoute().params
const userStore = useUserStore()

const { data: post, status } = useQuery({
  queryFn: () =>
    blogApi
      .auth(`Bearer ${userStore.userToken}`)
      .url(`/posts/${postId}`)
      .get()
      .json((data) => {
        const parsedData = PostResponseSchema.parse(data)
        return parsedData.data.post
      }),
  queryKey: ['posts', postId]
})
</script>

<template>
  <div v-if="status === 'loading'">Loading...</div>
  <ErrorWrapper v-else-if="status === 'error'">
    Unknown error has occured on loading post
  </ErrorWrapper>
  <PostEditor v-else :post="post!" />
</template>
