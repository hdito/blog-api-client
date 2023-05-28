import { z } from 'zod'

export const PostPostResponseSchema = z.object({
  message: z.string(),
  post: z.object({
    title: z.string(),
    _id: z.string()
  })
})
