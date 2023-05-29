<script setup lang="ts">
import { PostsResponseSchema } from '@/schemas/postsResponseSchema'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { DateTime } from 'luxon'

const queryFn = () =>
  blogApi.get('/posts').json((data) => {
    const parsedData = PostsResponseSchema.parse(data)
    return parsedData.posts
  })

const { data, status } = useQuery({ queryKey: ['posts'], queryFn })
</script>

<template>
  <div v-if="status === 'loading'">Loading...</div>
  <div class="w-fit border border-rose-800 bg-rose-300/50 px-4 py-2" v-else-if="status === 'error'">
    Error has occured on loading posts. Try again later.
  </div>
  <div v-else class="flex flex-col gap-4">
    <div class="" v-for="post in data" :key="post._id">
      <a :href="`/posts/${post._id}`">
        <h2 class="text-xl font-bold">{{ post.title }}</h2>
      </a>
      <p class="italic">
        {{ DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL) }}
      </p>
      <p v-if="post.description">{{ post.description }}</p>
    </div>
  </div>
</template>
