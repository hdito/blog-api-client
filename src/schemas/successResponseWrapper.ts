import { z } from 'zod'

export function successResponseWrapper<T extends z.ZodTypeAny>(data: T) {
  return z.object({
    status: z.literal('success'),
    data
  })
}
