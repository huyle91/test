import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false)
})

export const updateGroupSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().optional()
})

export type CreateGroupDto = z.infer<typeof createGroupSchema>
export type UpdateGroupDto = z.infer<typeof updateGroupSchema>
