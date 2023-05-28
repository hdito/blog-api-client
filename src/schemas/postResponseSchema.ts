import { PostSchema } from '@/types/post'
import { z } from 'zod'

export const PostResponseSchema = z.object({
  post: PostSchema
})

export type PostResponse = z.infer<typeof PostResponseSchema>
