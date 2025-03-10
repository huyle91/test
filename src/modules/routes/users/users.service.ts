import { CreateUserDto, UpdateUserDto } from '@/modules/routes/users/dtos'
import { UserRepository } from '@/modules/routes/users/repo/user.repository'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const existingUserEmail = await this.userRepository.findByEmail(
      createUserDto.email
    )
    if (existingUserEmail) {
      throw new BadRequestException('Email đã được sử dụng')
    }

    // Check if username already exists
    const existingUserUsername = await this.userRepository.findByUsername(
      createUserDto.username
    )
    if (existingUserUsername) {
      throw new BadRequestException('Username đã được sử dụng')
    }

    return this.userRepository.create(createUserDto)
  }

  async findAll() {
    return this.userRepository.findAll()
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email)
  }

  async findByUsername(username: string) {
    return this.userRepository.findByUsername(username)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if email already exists (if updating email)
    if (updateUserDto.email) {
      const existingUserEmail = await this.userRepository.findByEmail(
        updateUserDto.email
      )
      if (
        existingUserEmail &&
        existingUserEmail._id &&
        existingUserEmail._id.toString() !== id
      ) {
        throw new BadRequestException('Email đã được sử dụng')
      }
    }

    // Check if username already exists (if updating username)
    if (updateUserDto.username) {
      const existingUserUsername = await this.userRepository.findByUsername(
        updateUserDto.username
      )
      if (
        existingUserUsername &&
        existingUserUsername._id &&
        existingUserUsername._id.toString() !== id
      ) {
        throw new BadRequestException('Username đã được sử dụng')
      }
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto)

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return updatedUser
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id)

    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return { success: true, message: 'User successfully deleted' }
  }
}
