import type { Post } from '@/schemas/postSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useQueryClient, useMutation } from '@tanstack/vue-query'

export const usePublishPost = () => {
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
        .json(() => ({ postId, isPublished: value })),
    onSuccess: ({ postId, isPublished }) => {
      if (isPublished) {
        queryClient.invalidateQueries({ queryKey: queryPostsKey.all })
        return
      }

      queryClient.setQueryData(queryPostsKey.all, (prev) => {
        if (!prev) return
        return (prev as Post[]).filter((post) => post._id !== postId)
      })

      queryClient.setQueryData(queryPostsKey.my, (prev) => {
        if (!prev) return
        return (prev as Post[]).map((post) =>
          post._id === postId ? { ...post, isPublished } : post
        )
      })
      queryClient.setQueryData(queryPostsKey.post(postId), (prev) => {
        if (!prev) return
        return {
          ...(prev as Post),
          isPublished
        }
      })
    }
  })

  function publishPost(postId: string) {
    mutateIsPublished({ postId, value: true })
  }
  function unpublishPost(postId: string) {
    mutateIsPublished({ postId, value: false })
  }

  return { publishPost, unpublishPost }
}
