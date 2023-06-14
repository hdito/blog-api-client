import { z } from 'zod'

export const SupportedRoleSchema = z.union([
  z.literal('user'),
  z.literal('author'),
  z.literal('admin')
])

export type SupportedRole = z.infer<typeof SupportedRoleSchema>
