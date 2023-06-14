import { z } from 'zod'
import { SupportedRoleSchema } from './supportedRoleSchema'

export const UserSchema = z.object({
  displayName: z.string(),
  username: z.string(),
  email: z.string(),
  role: SupportedRoleSchema,
  _id: z.string()
})

export type User = z.infer<typeof UserSchema>
