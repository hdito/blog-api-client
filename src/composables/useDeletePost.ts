import type { Post } from '@/schemas/postSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export const useDeletePost = () => {
  const userStore = useUserStore()
  const queryClient = useQueryClient()

  const { mutate: deletePost } = useMutation({
    mutationFn: (postId: string) =>
      blogApi
        .auth(`Bearer ${userStore.userToken}`)
        .url(`/posts/${postId}`)
        .delete()
        .res(() => postId),
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: queryPostsKey.post(postId) })
      queryClient.setQueryData(queryPostsKey.my, (prev) => {
        if (!prev) return
        return (prev as Post[]).filter((post) => post._id !== postId)
      })
      queryClient.setQueryData(queryPostsKey.all, (prev) => {
        if (!prev) return
        return (prev as Post[]).filter((post) => post._id !== postId)
      })
    }
  })
  return { deletePost }
}
