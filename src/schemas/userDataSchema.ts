import { z } from 'zod'

export const UserDataSchema = z.object({
  id: z.string(),
  displayName:z.string(),
  role: z.union([z.literal('user'), z.literal('author'), z.literal('admin')])
})

export type UserData = z.infer<typeof UserDataSchema>
