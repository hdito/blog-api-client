<script setup lang="ts">
import { PostResponseSchema } from '@/schemas/postResponseSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import PostEditor from './PostEditor.vue'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { queryPostsKey } from '@/utils/queryPostsKeys'

const { postId } = useRoute().params
const userStore = useUserStore()

const { data: post, status } = useQuery({
  queryFn: () =>
    blogApi
      .auth(`Bearer ${userStore.userToken}`)
      .get(`/my-posts/${postId}`)
      .json((data) => {
        const parsedData = PostResponseSchema.parse(data)
        return parsedData.data.post
      }),
  queryKey: queryPostsKey.post(postId as string)
})
</script>

<template>
  <LoadingSpinner v-if="status === 'loading'" class="m-auto text-2xl" />
  <ErrorWrapper v-else-if="status === 'error'">
    Unknown error has occured on loading post
  </ErrorWrapper>
  <PostEditor v-else :post="post!" />
</template>
