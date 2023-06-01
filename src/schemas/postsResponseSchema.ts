import { PostSchema } from '@/schemas/postSchema'
import { z } from 'zod'
import { successResponseWrapper } from './successResponseWrapper'

export const PostsResponseSchema = successResponseWrapper(
  z.object({
    posts: z.array(PostSchema)
  })
)

export type PostsResponse = z.infer<typeof PostsResponseSchema>
