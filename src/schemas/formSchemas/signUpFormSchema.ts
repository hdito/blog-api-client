import { z } from 'zod'
import { usernameSchema } from './usernameSchema'
import { emailSchema } from './emailSchema'
import { passwordSchema } from './passwordSchema'

export const signUpFormSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    password2: passwordSchema
  })
  .refine(({ password, password2 }) => password === password2, {
    message: 'Passwords must match',
    path: ['password2']
  })

export type SignUpForm = z.infer<typeof signUpFormSchema>
