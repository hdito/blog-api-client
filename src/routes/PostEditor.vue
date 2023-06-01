<script setup lang="ts">
import { EditorPostSchema } from '@/schemas/editorPostSchema'
import { PostPostResponseSchema } from '@/schemas/postPostResponseSchema'
import type { Post } from '@/schemas/postSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { ref } from 'vue'

const props = defineProps<{ post?: Post }>()

const validationSchema = toTypedSchema(EditorPostSchema)

const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    title: props.post?.title ? props.post.title : '',
    description: props.post?.description ? props.post.description : '',
    content: props.post?.content ? props.post.content : ''
  }
})

const userStore = useUserStore()
const queryClient = useQueryClient()

const { mutate: postPost, error: postError } = useMutation({
  mutationFn: (values: { title: string; description?: string; content?: string }) =>
    blogApi
      .auth(`Bearer ${userStore.userToken}`)
      .url('/posts')
      .post({ ...values, author: userStore.user!.id })
      .json((data) => {
        const post = PostPostResponseSchema.parse(data).data.post
        postId.value = post._id
        return { postId: postId.value, post }
      }),
  onSuccess: ({ postId, post }) => {
    queryClient.setQueryData(queryPostsKey.post(postId), { ...post })
    queryClient.setQueryData(queryPostsKey.my, (prev) => {
      if (!prev) return
      return [post, ...(prev as Post[])]
    })
  }
})

const { mutate: updatePost, error: updateError } = useMutation({
  mutationFn: (values: { title: string; description?: string; content?: string }) =>
    blogApi
      .auth(`Bearer ${userStore.userToken}`)
      .url(`/posts/${postId.value}`)
      .put({ ...values })
      .json(() => ({ postId: postId.value!, values })),
  onSuccess: ({ postId, values }) => {
    queryClient.setQueryData(queryPostsKey.post(postId), (prev) => {
      if (!prev) return
      return { ...(prev as Post), ...values }
    })
    queryClient.setQueryData(queryPostsKey.my, (prev) => {
      if (!prev) return
      return (prev as Post[]).map((post) => (post._id === postId ? { ...post, ...values } : post))
    })
    queryClient.setQueryData(queryPostsKey.all, (prev) => {
      if (!prev) return
      return (prev as Post[]).map((post) => (post._id === postId ? { ...post, ...values } : post))
    })
  }
})

const onSubmit = handleSubmit((values) => {
  console.log({ values })
  if (postId.value === null) {
    postPost(values)
    return
  }
  updatePost(values)
})

const postId = ref<string | null>(props.post?._id ? props.post._id : null)
</script>

<template>
  <div
    class="mb-4 w-fit rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
    v-if="postError || updateError"
  >
    Error has occured on save. Try again later
  </div>
  <form class="flex flex-1 flex-col gap-4" action="" @submit.prevent="onSubmit">
    <div class="flex flex-col gap-2">
      <label for="title">Title</label>
      <Field class="rounded-md" type="text" id="title" name="title" />
      <ErrorMessage
        class="self-start rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
        name="title"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="description">Description</label>
      <Field class="rounded-md" type="text" id="description" name="description" />
      <ErrorMessage
        class="self-start rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
        name="description"
      />
    </div>
    <div class="flex flex-1 flex-col gap-2">
      <label for="content">Content</label>
      <Field v-slot="{ value, handleChange, handleBlur }" name="content">
        <textarea
          class="resize-none rounded-md"
          :value="value"
          @input="handleChange"
          @blur="handleBlur"
          id="content"
          cols="30"
          rows="10"
        />
      </Field>
      <ErrorMessage
        class="self-start rounded-md border border-rose-900 bg-rose-300/50 px-3 py-2 text-rose-900"
        name="content"
      />
    </div>
    <div class="flex items-center gap-4">
      <button class="block max-w-fit rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md">
        Save
      </button>
      <RouterLink class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md" to="/my-posts"
        >Cancel</RouterLink
      >
    </div>
  </form>
</template>
