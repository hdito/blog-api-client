import { z } from 'zod'
import { emailSchema } from './emailSchema'
import { passwordSchema } from './passwordSchema'
import { usernameSchema } from './usernameSchema'

export const signInFormSchema = z.union([
  z.object({
    username: usernameSchema,
    password: passwordSchema
  }),
  z.object({
    email: emailSchema,
    passwod: passwordSchema
  })
])
