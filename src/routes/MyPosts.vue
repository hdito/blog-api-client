<script setup lang="ts">
import { PostsResponseSchema } from '@/schemas/postsResponseSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

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
  <RouterLink to="/new-post">Create new post</RouterLink>
  <div v-if="status === 'loading'">Loading...</div>
  <div v-else-if="status === 'error'">Error has occured on loading posts. Try again later.</div>
  <template v-if="status === 'success'">
    <div>
      <h2>Published posts</h2>
      <div v-if="publishedPosts.length === 0">You haven't got any published posts</div>
      <div v-else>
        <div v-for="post in publishedPosts" :key="post._id">
          <h3>{{ post.title }}</h3>
          <button @click="() => unpublishPost(post._id)">Unpublish</button>
          <RouterLink :to="`/edit/${post._id}`">Edit</RouterLink>
          <button @click="() => deletePost(post._id)">Delete</button>
        </div>
      </div>
    </div>
    <div>
      <h2>Unpublished posts</h2>
      <div v-if="unpublishedPosts.length === 0">You haven't got any published posts</div>
      <div v-else>
        <div v-for="post in unpublishedPosts" :key="post._id">
          <h3>{{ post.title }}</h3>
          <button @click="() => publishPost(post._id)">Publish</button>
          <RouterLink :to="`/edit/${post._id}`">Edit</RouterLink>
          <button @click="() => deletePost(post._id)">Delete</button>
        </div>
      </div>
    </div>
  </template>
</template>
