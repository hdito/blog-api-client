<script setup lang="ts">
import { PostResponseSchema } from '@/schemas/postResponseSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import PostEditor from './PostEditor.vue'

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
        return parsedData.post
      }),
  queryKey: ['posts', postId]
})
</script>

<template>
  <div v-if="status === 'loading'">Loading...</div>
  <div
    class="w-fit rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
    v-else-if="status === 'error'"
  >
    Unknown error has occured on loading post
  </div>
  <PostEditor v-else :post="post!" />
</template>
