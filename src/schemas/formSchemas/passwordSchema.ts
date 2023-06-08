import { z } from 'zod'

export const passwordSchema = z
  .string({ required_error: "Can't be empty" })
  .min(8, 'Password must be at least 8 characters long')
  .refine(
    (value) => value.match(/[A-Z]/) !== null,
    'Password must contain at least of one uppercase letter'
  )
  .refine(
    (value) => value.match(/[a-z]/) !== null,
    'Password must contain at least of one lowercase letter'
  )
  .refine((value) => value.match(/\d/) !== null, 'Password must contain at least one digit')
