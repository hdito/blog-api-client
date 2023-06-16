import { CommentFormSchema } from '@/schemas/formSchemas/commentFormSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

export const useCommentForm = () => {
  const userStore = useUserStore()

  const route = useRoute()
  const { postId } = route.params

  const queryClient = useQueryClient()

  const toast = useToast()

  const { handleSubmit, resetForm } = useForm({
    validationSchema: toTypedSchema(CommentFormSchema)
  })

  const onSubmitComment = handleSubmit((values) => {
    createComment(values)
  })

  const { mutate: createComment, status: createCommentStatus } = useMutation({
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

  return { createCommentStatus, onSubmitComment }
}
