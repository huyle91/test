import { z } from 'zod'

export const updateUserSchema = z.object({
  email: z.string().email('Email không hợp lệ').optional(),
  username: z.string().min(3, 'Username phải có ít nhất 3 ký tự').optional()
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>
