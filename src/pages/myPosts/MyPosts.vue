<script setup lang="ts">
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import MyPostCard from './MyPostCard.vue'
import { useMyPostsQuery } from './useMyPostsQuery'
import { RouterLink } from 'vue-router'

const { publishedPosts, unpublishedPosts, status } = useMyPostsQuery()
</script>

<template>
  <RouterLink
    class="mb-4 block max-w-fit rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
    to="/new-post"
  >
    Create new post
  </RouterLink>
  <LoadingSpinner v-if="status === 'loading'" class="m-auto text-2xl" />
  <ErrorWrapper v-else-if="status === 'error'">
    Error has occured on loading posts. Try again later.
  </ErrorWrapper>
  <template v-if="status === 'success'">
    <div>
      <h2 class="mb-2 text-2xl font-bold">Published posts</h2>
      <div v-if="publishedPosts.length === 0">You haven't got any published posts</div>
      <div class="mb-6 flex flex-col gap-4" v-else>
        <MyPostCard v-for="post in publishedPosts" :key="post._id" :post="post" />
      </div>
    </div>
    <div>
      <h2 class="mb-2 text-2xl font-bold">Unpublished posts</h2>
      <div v-if="unpublishedPosts.length === 0">You haven't got any unpublished posts</div>
      <div class="mb-6 flex flex-col gap-4" v-else>
        <MyPostCard v-for="post in unpublishedPosts" :key="post._id" :post="post" />
      </div>
    </div>
  </template>
</template>
