import { z } from 'zod'

export const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  group: z.string().min(1) // MongoDB ObjectId
})

export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000)
})

export type CreatePostDto = z.infer<typeof createPostSchema>
export type UpdatePostDto = z.infer<typeof updatePostSchema>
