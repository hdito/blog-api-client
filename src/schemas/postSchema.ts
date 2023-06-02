import { z } from 'zod'

export const PostSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  content: z.string().optional(),
  createdAt: z.string(),
  _id: z.string(),
  isPublished: z.boolean(),
  author: z.object({ username: z.string(), _id: z.string() })
})

export type Post = z.infer<typeof PostSchema>
