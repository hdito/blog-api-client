<script setup lang="ts">
import { PostResponseSchema } from '@/schemas/postResponseSchema'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'

const { postId } = useRoute().params

const queryFn = () =>
  blogApi.get(`/posts/${postId}`).json((data) => {
    const parsedData = PostResponseSchema.parse(data)
    return parsedData.post
  })

const { data: post, status } = useQuery({
  queryKey: ['posts', postId],
  queryFn
})
</script>

<template>
  <div v-if="status === 'loading'">Loading...</div>
  <div v-else-if="status === 'error'">Error has occured on loading post. Try again later.</div>
  <h2 v-if="!post">Post not found</h2>
  <div v-else>
    <h2>{{ post.title }}</h2>
    <p v-if="post.description">{{ post.description }}</p>
    <p>{{ new Date(post.createdAt).toLocaleDateString() }}</p>
    <p v-if="post.content">{{ post.content }}</p>
  </div>
</template>
