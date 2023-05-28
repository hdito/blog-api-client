import { z } from 'zod'

export const emailSchema = z
  .string({ required_error: "Can't be empty" })
  .nonempty("Can't be empty")
  .email('Invalid email format')
