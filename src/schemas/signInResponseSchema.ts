import { z } from 'zod'
import { successResponseWrapper } from './successResponseWrapper'

export const signInResponseSchema = successResponseWrapper(z.object({ token: z.string() }))
