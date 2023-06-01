import { z } from 'zod'
import { successResponseWrapper } from './successResponseWrapper'

export const PostPostResponseSchema = successResponseWrapper(
  z.object({
    post: z.object({
      title: z.string(),
      _id: z.string()
    })
  })
)
