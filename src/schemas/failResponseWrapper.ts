import { z } from 'zod'

export function failResponseWrapper<T extends z.ZodTypeAny>(data: T) {
  return z.object({
    status: z.literal('fail'),
    data
  })
}
