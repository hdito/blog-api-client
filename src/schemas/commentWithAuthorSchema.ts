import { z } from 'zod'

export const CommentWithAuthorSchema = z.object({
  body: z.string(),
  author: z.object({
    _id: z.string(),
    username: z.string()
  }),
  _id: z.string(),
  createdAt: z.string()
})

export type CommentWithAuthor = z.infer<typeof CommentWithAuthorSchema>
