<script setup lang="ts">
import type { Post } from '@/schemas/postSchema'
import { toRefs } from 'vue'
import { DateTime } from 'luxon'
import { usePublishPost } from '@/composables/usePublishPost'
import { useDeletePost } from '@/composables/useDeletePost'

type MyPostCardProps = {
  post: Post
}

const props = defineProps<MyPostCardProps>()
const { post } = toRefs(props)

const { publishPost, unpublishPost } = usePublishPost()
const { deletePost } = useDeletePost()
</script>

<template>
  <div>
    <RouterLink :to="post.isPublished ? `/posts/${post._id}` : `/posts/${post._id}?type=preview`">
      <h3 class="font-bold">{{ post.title }}</h3>
    </RouterLink>
    <p class="italic">
      {{ DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL) }}
    </p>
    <p v-if="post.description">{{ post.description }}</p>
    <div class="mt-2 flex items-center gap-4">
      <button
        class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md"
        @click="() => (post.isPublished ? unpublishPost(post._id) : publishPost(post._id))"
      >
        <template v-if="post.isPublished">Unpublish</template>
        <template v-else>Publish</template>
      </button>
      <RouterLink
        class="rounded-md border border-emerald-700 px-2 py-1 text-emerald-700 hover:shadow-md"
        :to="`/edit/${post._id}`"
        >Edit</RouterLink
      >
      <button
        class="rounded-md border border-rose-900 px-2 py-1 text-rose-900 hover:shadow-md"
        @click="() => deletePost(post._id)"
      >
        Delete
      </button>
    </div>
  </div>
</template>
