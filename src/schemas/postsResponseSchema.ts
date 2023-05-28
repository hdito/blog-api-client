import { PostSchema } from '@/types/post'
import { z } from 'zod'

export const PostsResponseSchema = z.object({
  posts: z.array(PostSchema)
})

export type PostsResponse = z.infer<typeof PostsResponseSchema>
