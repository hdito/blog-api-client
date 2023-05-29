<script setup lang="ts">
import { PostsResponseSchema } from '@/schemas/postsResponseSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { DateTime } from 'luxon'

const userStore = useUserStore()

const queryClient = useQueryClient()

const { mutate: mutateIsPublished } = useMutation({
  mutationFn: ({ postId, value }: { postId: string; value: boolean }) =>
    blogApi
      .url(`/posts/${postId}`)
      .auth(`Bearer ${userStore.userToken}`)
      .put({
        isPublished: value
      })
      .json((data) => console.log(data)),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['my-posts'] })
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }
})
function publishPost(postId: string) {
  mutateIsPublished({ postId, value: true })
}
function unpublishPost(postId: string) {
  mutateIsPublished({ postId, value: false })
}

const { mutate: deletePost } = useMutation({
  mutationFn: (postId: string) =>
    blogApi
      .auth(`Bearer ${userStore.userToken}`)
      .url(`/posts/${postId}`)
      .delete()
      .res((data) => console.log(data)),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['my-posts'] })
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }
})

const { data: posts, status } = useQuery({
  queryKey: ['my-posts'],
  queryFn: () =>
    blogApi
      .auth(`Bearer ${userStore.userToken}`)
      .get('/posts?type=own')
      .json((data) => {
        const parsedData = PostsResponseSchema.parse(data)
        return parsedData.posts
      })
})
const unpublishedPosts = computed(() => {
  if (!posts.value) return []
  return posts.value.filter((post) => !post.isPublished)
})
const publishedPosts = computed(() => {
  if (!posts.value) return []
  return posts.value.filter((post) => post.isPublished)
})
</script>

<template>
  <RouterLink
    class="mb-4 block max-w-fit rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
    to="/new-post"
  >
    Create new post
  </RouterLink>
  <div v-if="status === 'loading'">Loading...</div>
  <div
    class="w-fit rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
    v-else-if="status === 'error'"
  >
    Error has occured on loading posts. Try again later.
  </div>
  <template v-if="status === 'success'">
    <div>
      <h2 class="mb-2 text-2xl font-bold">Published posts</h2>
      <div v-if="publishedPosts.length === 0">You haven't got any published posts</div>
      <div class="mb-6 flex flex-col gap-4" v-else>
        <div v-for="post in publishedPosts" :key="post._id">
          <h3 class="font-bold">{{ post.title }}</h3>
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
          <h3 class="font-bold">{{ post.title }}</h3>
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
