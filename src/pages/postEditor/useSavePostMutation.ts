import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

export const useSavePostMutation = (postId?: string) => {
  const isNew = ref(postId ? false : true)

  const userStore = useUserStore()
  const queryClient = useQueryClient()

  const toast = useToast()

  const { mutate: savePost, status: savePostStatus } = useMutation({
    mutationFn: (values: { title: string; description?: string; content?: string }) =>
      isNew.value
        ? blogApi
            .auth(`Bearer ${userStore.userToken}`)
            .url('/posts')
            .post({ ...values, author: userStore.user!.id })
            .json(() => {
              isNew.value = false
            })
        : blogApi
            .auth(`Bearer ${userStore.userToken}`)
            .url(`/posts/${postId}`)
            .patch({ ...values })
            .json(),
    onSuccess: () => {
      toast.success('Saved')
      queryClient.invalidateQueries({ queryKey: queryPostsKey.all })
    },
    onError: () => {
      toast.error('Unknown error on save. Try again later')
    }
  })
  return { savePost, savePostStatus }
}
