import { PostResponseSchema } from '@/schemas/postResponseSchema'
import { PostSchema } from '@/schemas/postSchema'
import { successResponseWrapper } from '@/schemas/successResponseWrapper'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { z } from 'zod'

export const usePostQuery = () => {
  const userStore = useUserStore()

  const route = useRoute()
  const { postId } = route.params
  const { type } = route.query

  const { data: post, status: postLoadingStatus } = useQuery({
    queryKey: queryPostsKey.post(postId as string),
    queryFn: () => {
      if (type === 'preview') {
        return blogApi
          .auth(`Bearer ${userStore.userToken}`)
          .get(`/my-posts/${postId}`)
          .json((data) => {
            const parsedData = successResponseWrapper(z.object({ post: PostSchema })).parse(data)
            return parsedData.data.post
          })
      }
      return blogApi.get(`/posts/${postId}`).json((data) => {
        const parsedData = PostResponseSchema.parse(data)
        return parsedData.data.post
      })
    }
  })
  return { post, postLoadingStatus }
}
