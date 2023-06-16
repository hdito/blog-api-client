import { PostWithAuthorSchema } from '@/schemas/postWithAuthorSchema'
import { successResponseWrapper } from '@/schemas/successResponseWrapper'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'

export const usePostsQuery = () => {
  const { data: posts, status: postsLoadingStatus } = useQuery({
    queryKey: queryPostsKey.all,
    queryFn: () =>
      blogApi.get('/posts?populate=author').json((data) => {
        const parsedData = successResponseWrapper(
          z.object({ posts: z.array(PostWithAuthorSchema) })
        ).parse(data)
        return parsedData.data.posts
      })
  })
  return { posts, postsLoadingStatus }
}
