<script setup lang="ts">
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { PostWithAuthorSchema } from '@/schemas/postWithAuthorSchema'
import { successResponseWrapper } from '@/schemas/successResponseWrapper'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'

const { data, status } = useQuery({
  queryKey: queryPostsKey.all,
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
    <PostCard v-for="post in data" :key="post._id" :post="post" />
  </div>
</template>
