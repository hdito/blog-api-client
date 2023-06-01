import { z } from 'zod'
import { failResponseWrapper } from './failResponseWrapper'

export const badRequestResponseSchema = failResponseWrapper(
  z.array(z.object({ message: z.string(), path: z.string() }))
)
