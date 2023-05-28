<script setup lang="ts">
import { EditorPostSchema } from '@/schemas/editorPostSchema'
import { PostPostResponseSchema } from '@/schemas/postPostResponseSchema'
import type { Post } from '@/types/post'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
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
        postId.value = PostPostResponseSchema.parse(data).post._id
      }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts', postId.value] })
  }
})

const { mutate: updatePost, error: updateError } = useMutation({
  mutationFn: (values: { title: string; description?: string; content?: string }) =>
    blogApi
      .auth(`Bearer ${userStore.userToken}`)
      .url(`/posts/${postId.value}`)
      .put({ ...values })
      .json(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts', postId.value] })
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
  <div v-if="postError || updateError">Error occured on save. Try again later</div>
  <form action="" @submit.prevent="onSubmit">
    <div>
      <label for="title">Title</label>
      <Field type="text" id="title" name="title" />
      <ErrorMessage name="title" />
    </div>
    <div>
      <label for="description">Description</label>
      <Field type="text" id="description" name="description" />
      <ErrorMessage name="description" />
    </div>
    <div>
      <label for="content">Content</label>
      <Field name="content" id="content" cols="30" rows="10"></Field>
      <ErrorMessage name="content" />
    </div>
    <button>Save</button>
  </form>
</template>
