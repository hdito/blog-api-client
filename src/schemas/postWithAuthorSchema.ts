import { z } from 'zod'

export const PostWithAuthorSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  content: z.string().optional(),
  createdAt: z.string(),
  _id: z.string(),
  isPublished: z.boolean(),
  author: z.object({ _id: z.string(), username: z.string() })
})

export type PostWithAuthor = z.infer<typeof PostWithAuthorSchema>
