import type { Post } from '@/schemas/postSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'vue-toastification'

export const useDeletePostMutation = () => {
  const userStore = useUserStore()
  const queryClient = useQueryClient()

  const toast = useToast()

  const { mutate: deletePost } = useMutation({
    mutationFn: (postId: string) =>
      blogApi
        .auth(`Bearer ${userStore.userToken}`)
        .url(`/posts/${postId}`)
        .delete()
        .res(() => postId),
    onSuccess: (postId) => {
      toast.success('Post deleted!')
      queryClient.invalidateQueries({ queryKey: queryPostsKey.post(postId) })
      queryClient.setQueryData(queryPostsKey.my, (prev) => {
        if (!prev) return
        return (prev as Post[]).filter((post) => post._id !== postId)
      })
      queryClient.setQueryData(queryPostsKey.all, (prev) => {
        if (!prev) return
        return (prev as Post[]).filter((post) => post._id !== postId)
      })
    },
    onError: () => {
      toast.error('Unknown error on deleting post. Try again later')
    }
  })
  return { deletePost }
}
