import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export const usePublishPost = () => {
  const userStore = useUserStore()
  const queryClient = useQueryClient()

  const { mutate: mutateIsPublished } = useMutation({
    mutationFn: ({ postId, isPublished }: { postId: string; isPublished: boolean }) =>
      blogApi
        .url(`/posts/${postId}`)
        .auth(`Bearer ${userStore.userToken}`)
        .patch({
          isPublished
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryPostsKey.all })
      queryClient.invalidateQueries({ queryKey: queryPostsKey.my })
    }
  })

  function publishPost(postId: string) {
    mutateIsPublished({ postId, isPublished: true })
  }
  function unpublishPost(postId: string) {
    mutateIsPublished({ postId, isPublished: false })
  }

  return { publishPost, unpublishPost }
}
