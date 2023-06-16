<script setup lang="ts">
import { CommentFormSchema } from '@/schemas/formSchemas/commentFormSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()

const route = useRoute()
const { postId } = route.params

const queryClient = useQueryClient()

const toast = useToast()

const { mutate: postComment, status: postCommentStatus } = useMutation({
  mutationFn: (values: { body: string }) =>
    blogApi
      .auth(`Bearer ${userStore.userToken}`)
      .url(`/posts/${postId}/comments/`)
      .post(values)
      .json(() => {}),
  onSuccess: () => {
    toast.success('Comment created!')
    queryClient.invalidateQueries({ queryKey: queryPostsKey.postComments(postId as string) })
    resetForm()
  },
  onError: () => {
    toast.error('Unknwon error on posting comment. Try again later')
  }
})

const validationSchema = toTypedSchema(CommentFormSchema)
const { handleSubmit, resetForm } = useForm({ validationSchema })

const onSubmit = handleSubmit((values) => {
  postComment(values)
})
</script>

<template>
  <RouterLink
    v-if="!userStore.user"
    to="/sign-in"
    class="self-start rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
  >
    Sign in to comment
  </RouterLink>
  <template v-else>
    <form action="" method="post" @submit="onSubmit">
      <CustomFormField input-type="textarea" :rows="3" name="body" label="Your comment" />
      <button
        class="mt-2 flex h-8 w-28 items-center justify-center self-start rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
      >
        <LoadingSpinner v-if="postCommentStatus === 'loading'" />
        <span v-else>Comment</span>
      </button>
    </form>
  </template>
</template>
