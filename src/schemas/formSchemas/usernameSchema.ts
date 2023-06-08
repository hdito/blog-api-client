import { z } from 'zod'

export const usernameSchema = z
  .string({ required_error: "Can't be empty" })
  .nonempty("Can't be empty")
