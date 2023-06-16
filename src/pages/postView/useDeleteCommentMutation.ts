import type { CommentWithAuthor } from '@/schemas/commentWithAuthorSchema'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useUserStore } from '@/userStore'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

export const useDeleteCommentMutation = () => {
  const userStore = useUserStore()

  const route = useRoute()
  const { postId } = route.params

  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId: string) =>
      blogApi
        .auth(`Bearer ${userStore.userToken}`)
        .url(`/posts/${postId}/comments/${commentId}`)
        .delete()
        .res(() => commentId),
    onSuccess: (commentId) => {
      toast.success('Comment deleted!')
      queryClient.setQueryData(queryPostsKey.postComments(postId as string), (prev) =>
        (prev as CommentWithAuthor[]).filter((comment) => comment._id !== commentId)
      )
    },
    onError: () => {
      toast.error('Unknown error on deleting comment. Try again later')
    }
  })
  return { deleteComment }
}
