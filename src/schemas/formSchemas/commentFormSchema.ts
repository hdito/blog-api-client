import { z } from 'zod'

export const CommentFormSchema = z.object({
  body: z.string({ required_error: 'Must be filled' }).nonempty('Must be filled')
})
