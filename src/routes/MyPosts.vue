<script setup lang="ts">
import { useDeletePost } from '@/composables/useDeletePost'
import { useMyPosts } from '@/composables/useMyPosts'
import { usePublishPost } from '@/composables/usePublishPost'
import { DateTime } from 'luxon'
import { RouterLink } from 'vue-router'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { publishedPosts, unpublishedPosts, status } = useMyPosts()
const { publishPost, unpublishPost } = usePublishPost()
const { deletePost } = useDeletePost()
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
        <div v-for="post in publishedPosts" :key="post._id">
          <RouterLink :to="`/posts/${post._id}`">
            <h3 class="font-bold">{{ post.title }}</h3>
          </RouterLink>
          <p class="italic">
            {{ DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL) }}
          </p>
          <p v-if="post.description">{{ post.description }}</p>
          <div class="mt-2 flex items-center gap-4">
            <button
              class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md"
              @click="() => unpublishPost(post._id)"
            >
              Unpublish
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
      </div>
    </div>
    <div>
      <h2 class="mb-2 text-2xl font-bold">Unpublished posts</h2>
      <div v-if="unpublishedPosts.length === 0">You haven't got any unpublished posts</div>
      <div class="mb-6 flex flex-col gap-4" v-else>
        <div v-for="post in unpublishedPosts" :key="post._id">
          <RouterLink :to="`/posts/${post._id}?type=preview`">
            <h3 class="font-bold">{{ post.title }}</h3>
          </RouterLink>
          <p class="italic">
            {{ DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL) }}
          </p>
          <p v-if="post.description">{{ post.description }}</p>
          <div class="mt-2 flex items-center gap-4">
            <button
              class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md"
              @click="() => publishPost(post._id)"
            >
              Publish
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
      </div>
    </div>
  </template>
</template>
