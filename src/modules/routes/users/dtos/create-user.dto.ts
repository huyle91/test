import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  username: z.string().min(3, 'Username phải có ít nhất 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

export type CreateUserDto = z.infer<typeof createUserSchema>
