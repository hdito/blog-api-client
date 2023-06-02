import { z } from 'zod'

export const EditorPostSchema = z.object({
  title: z.string().nonempty("Can't be empty"),
  description: z.string().max(50, 'Description is too long').optional(),
  content: z.string().optional()
})
