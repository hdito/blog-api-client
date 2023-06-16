import { CommentWithAuthorSchema } from '@/schemas/commentWithAuthorSchema'
import { successResponseWrapper } from '@/schemas/successResponseWrapper'
import { blogApi } from '@/utils/blogApi'
import { queryPostsKey } from '@/utils/queryPostsKeys'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { z } from 'zod'

export const useCommentsQuery = () => {
  const route = useRoute()
  const { postId } = route.params

  const { data: comments, status: commentsLoadingStatus } = useQuery({
    queryKey: queryPostsKey.postComments(postId as string),
    queryFn: () =>
      blogApi.get(`/posts/${postId}/comments`).json((data) => {
        console.dir(data)
        const comments = successResponseWrapper(
          z.object({ comments: z.array(CommentWithAuthorSchema) })
        ).parse(data).data.comments
        return comments
      })
  })

  return { comments, commentsLoadingStatus }
}
