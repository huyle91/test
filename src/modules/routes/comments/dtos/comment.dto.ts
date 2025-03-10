import { z } from 'zod'

export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  post: z.string().min(1) // MongoDB ObjectId
})

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(1000)
})

export type CreateCommentDto = z.infer<typeof createCommentSchema>
export type UpdateCommentDto = z.infer<typeof updateCommentSchema>
