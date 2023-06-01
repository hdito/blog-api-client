import { PostSchema } from '@/schemas/postSchema'
import { successResponseWrapper } from './successResponseWrapper'
import { z } from 'zod'

export const PostResponseSchema = successResponseWrapper(
  z.object({
    post: PostSchema
  })
)

export type PostResponse = z.infer<typeof PostResponseSchema>
