<script setup lang="ts">
import { PostsResponseSchema } from '@/schemas/postsResponseSchema'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'

const queryFn = () =>
  blogApi.get('/posts').json((data) => {
    const parsedData = PostsResponseSchema.parse(data)
    return parsedData.posts
  })

const { data, status } = useQuery({ queryKey: ['posts'], queryFn })
</script>

<template>
  <div v-if="status === 'loading'">Loading...</div>
  <div v-else-if="status === 'error'">Error has occured on loading posts. Try again later.</div>
  <div v-else v-for="post in data" :key="post._id">
    <a :href="`/posts/${post._id}`">
      <h2>{{ post.title }}</h2>
    </a>
    <p v-if="post.description">{{ post.description }}</p>
  </div>
</template>
