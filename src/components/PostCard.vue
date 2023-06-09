<script setup lang="ts">
import type { PostWithAuthor } from '@/schemas/postWithAuthorSchema'
import { DateTime } from 'luxon'
import { toRefs } from 'vue'
import { RouterLink } from 'vue-router'

type PostCardProps = {
  post: PostWithAuthor
}

const props = defineProps<PostCardProps>()
const { post } = toRefs(props)
</script>

<template>
  <div>
    <RouterLink :to="`/posts/${post._id}`">
      <h2 class="text-xl font-bold">{{ post.title }}</h2>
    </RouterLink>
    <span>
      By <span class="font-bold">{{ post.author.username }}</span> •
    </span>
    <span class="italic">
      {{ DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL) }}
    </span>
    <p v-if="post.description">{{ post.description }}</p>
  </div>
</template>
