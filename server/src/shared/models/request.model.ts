import { z } from 'zod'

export const EmptyBodySchema = z.object({}).strict()

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1), // English content normalized from the original source text.
  limit: z.coerce.number().int().positive().default(10), // English content normalized from the original source text.
  sortBy: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export type EmptyBodyType = z.infer<typeof EmptyBodySchema>
export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>
