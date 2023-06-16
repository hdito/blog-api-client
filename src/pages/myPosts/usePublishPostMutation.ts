import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'vue-toastification'

export const usePublishPostMutation = () => {
  const userStore = useUserStore()
  const queryClient = useQueryClient()

  const toast = useToast()

  const { mutate: mutateIsPublished } = useMutation({
    mutationFn: ({ postId, isPublished }: { postId: string; isPublished: boolean }) =>
      blogApi
        .url(`/posts/${postId}`)
        .auth(`Bearer ${userStore.userToken}`)
        .patch({
          isPublished
        })
        .json(),
    onSuccess: (data, { isPublished }) => {
      toast.success(`Post ${isPublished ? 'published' : 'unpublished'}!`)
      queryClient.invalidateQueries({ queryKey: queryPostsKey.all })
      queryClient.invalidateQueries({ queryKey: queryPostsKey.my })
    },
    onError: (error, { isPublished }) => {
      toast.error(
        `Unknown error on ${isPublished ? 'publishing' : 'unpublishing'} post. Try again later`
      )
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
