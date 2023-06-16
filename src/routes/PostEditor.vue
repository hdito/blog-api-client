<script setup lang="ts">
import CustomFormField from '@/components/CustomFormField.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { EditorPostSchema } from '@/schemas/formSchemas/editorPostSchema'
import { PostPostResponseSchema } from '@/schemas/postPostResponseSchema'
import type { Post } from '@/schemas/postSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

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

const toast = useToast()

const { mutate: postPost, status: postStatus } = useMutation({
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
  onSuccess: () => {
    toast.success('Saved')
    queryClient.invalidateQueries({ queryKey: queryPostsKey.all })
  },
  onError: () => {
    toast.error('Unknown error on save. Try again later')
  }
})

const { mutate: updatePost, status: updateStatus } = useMutation({
  mutationFn: (values: { title: string; description?: string; content?: string }) =>
    blogApi
      .auth(`Bearer ${userStore.userToken}`)
      .url(`/posts/${postId.value}`)
      .patch({ ...values })
      .json(() => ({ postId: postId.value!, values })),

  onSuccess: () => {
    toast.success('Saved')

    queryClient.invalidateQueries({ queryKey: queryPostsKey.all })
  },
  onError: () => {
    toast.error('Unknown error on save. Try again later')
  }
})

const onSubmit = handleSubmit((values) => {
  if (postId.value === null) {
    postPost(values)
    return
  }
  updatePost(values)
})

const postId = ref<string | null>(props.post?._id ? props.post._id : null)
</script>

<template>
  <form class="flex flex-1 flex-col gap-4" action="" @submit.prevent="onSubmit">
    <CustomFormField input-type="text" label="Title" name="title" :allow-growth="true" />
    <CustomFormField
      input-type="text"
      label="Description"
      name="description"
      :allow-growth="true"
    />
    <CustomFormField input-type="textarea" label="Content" name="content" :allow-growth="true" />
    <div class="flex items-center gap-4">
      <button
        class="flex h-8 w-16 items-center justify-center rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
      >
        <LoadingSpinner v-if="updateStatus === 'loading' || postStatus === 'loading'" />
        <span v-else>Save</span>
      </button>
      <RouterLink class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md" to="/my-posts"
        >Cancel</RouterLink
      >
    </div>
  </form>
</template>
